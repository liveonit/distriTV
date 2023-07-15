import { config } from '@src/config';
import { Content } from '@src/entities/Content';
import { BaseService } from '@lib/BaseClasses/BaseService';
import fileUpload, { UploadedFile } from 'express-fileupload';
import path from 'path';
import { Request, Response } from 'express';
import { BadRequest, NotFound } from '@src/lib/errors';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  S3ClientConfig,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';
import { ReadableWebToNodeStream } from 'readable-web-to-node-stream';
import { Blob } from 'buffer';
import { s3StreamGetObject } from './s3Helpers';

export class ContentSvc extends BaseService<Content> {
  private isSingleFile(file: UploadedFile | UploadedFile[]): file is UploadedFile {
    return typeof file === 'object' && (file as UploadedFile).name !== undefined;
  }

  public async uploadFiles(files: fileUpload.FileArray) {
    // Uploaded path
    const uploadedFiles = this.isSingleFile(files.file) ? [files.file] : files.file;
    const result = await Promise.allSettled(
      uploadedFiles.map(async (uploadedFile) => {
        const uploadPath = path.resolve(config.PATH_TO_UPLOAD_FILES, uploadedFile.name);
        await uploadedFile.mv(uploadPath);
        return uploadPath;
      }),
    );

    return result.map((res) => {
      if (res.status === 'fulfilled')
        return {
          status: 'uploaded',
          filePath: `${config.API_PREFIX}/v1/content/download${res.value.replace(
            config.PATH_TO_UPLOAD_FILES,
            '',
          )}`,
        };
      return {
        status: 'failed',
        reason: res.reason,
      };
    });
  }

  public async s3UploadFile(files: fileUpload.FileArray, contentType: string) {
    const s3Config: S3ClientConfig = {
      region: config.AWS_REGION,
      endpoint: config.STORAGE_ENDPOINT,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID!,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY!,
      },
    };
    const s3Client = new S3Client(s3Config);
    const uploadedFile = this.isSingleFile(files.file) ? files.file : files.file[0];
    const bucketParams: PutObjectCommandInput = {
      Bucket: config.BUCKET_NAME!,
      Key: uploadedFile.name,
      Body: uploadedFile.data,
      ContentType: contentType,
      ContentLength: uploadedFile.data.length,
    };
    await s3Client.send(new PutObjectCommand(bucketParams)).catch(logger.error);
    return {
      status: 'uploaded',
      filePath: `${config.API_PREFIX}/v1/content/download/${uploadedFile.name}`,
    };
  }

  public async s3DownloadFile(req: Request, res: Response) {
    // download the file via aws s3 here
    const fileKey = req.params.path;
    if (!fileKey) throw new BadRequest('File path should be specified as path parameter');
    return await s3StreamGetObject(res, config.BUCKET_NAME!, fileKey);
  }
}
export const contentSvc = new ContentSvc(Content);
