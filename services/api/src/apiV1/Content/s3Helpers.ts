import {
  GetObjectCommand,
  GetObjectTaggingCommand,
  HeadObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { config } from '@src/config';
import { NotFound } from '@src/lib/errors';
import { Response } from 'express';
import { Readable } from 'typeorm/platform/PlatformTools';

/**
 *
 * @param {*} res
 * @param {string} bucketName Bucket Name
 * @param {string} key Object key
 * @param {number} cacheExpiration Cache expiration in ms
 * @param {boolean} streamTags Forward object tags in http-headers
 */
export async function s3StreamGetObject(
  res: Response,
  bucketName: string,
  key: string,
  cacheExpiration?: number,
  streamTags?: boolean,
) {
  const s3Config: S3ClientConfig = {
    region: config.AWS_REGION,
    endpoint: config.STORAGE_ENDPOINT,
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID!,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY!,
    },
  };

  const s3Client = new S3Client(s3Config);

  try {
    const params = {
      Bucket: bucketName,
      Key: key,
    };
    // Head the object to get classic the bare minimum http-headers information
    const headResponse = await s3Client.send(new HeadObjectCommand(params));
    res.set({
      'Content-Length': headResponse.ContentLength,
      'Content-Type': headResponse.ContentType,
      ETag: headResponse.ETag,
      'Content-disposition': 'attachment; filename=' + key,
    });
    // Get the object taggings (optional)
    if (streamTags === true) {
      const taggingResponse = await s3Client.send(new GetObjectTaggingCommand(params));
      taggingResponse.TagSet?.forEach((tag) => {
        res.set('X-TAG-' + tag.Key, tag.Value);
      });
    }
    // Prepare cache headers
    if (typeof cacheExpiration === 'number') {
      res.setHeader('Cache-Control', 'public, max-age=' + cacheExpiration / 1000);
      res.setHeader('Expires', new Date(Date.now() + cacheExpiration).toUTCString());
    } else {
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Expires', 0);
    }

    // Now get the object data and stream it
    const response = await s3Client.send(new GetObjectCommand(params));
    const stream = response.Body as Readable;
    if (!stream) {
      throw new NotFound();
    }

    stream.on('data', (chunk: any) => res.write(chunk));
    stream.once('end', () => {
      res.end();
    });
    stream.once('error', () => {
      res.end();
    });
  } catch (err) {
    logger.error(err);
    throw err;
  }
}
