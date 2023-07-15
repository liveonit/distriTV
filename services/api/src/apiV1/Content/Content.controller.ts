import { config } from '@src/config';
import { Content } from '@src/entities/Content';
import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { BadRequest } from '@lib/errors';
import { Request, Response } from 'express';
import path from 'path';
import { ContentSvc, contentSvc } from './Content.service';
import { createContentBody } from './types/CreateContentBody';
import { updateContentBody } from './types/UpdateContentBody';

class ContentController extends BaseController<Content, ContentSvc> {
  public uploadFiles = handleErrorAsync(async (req: Request, res: Response) => {
    const { files, body } = req;
    let result: any = {};
    if (files && Object.keys(files).length === 1) {
      if (config.STORAGE_TYPE === 'local') result = await this.service.uploadFiles(files);
      if (config.STORAGE_TYPE === 's3') result = await this.service.s3UploadFile(files, body.type);
      return res.json(result);
    } else throw new BadRequest('One file must be provided');
  });

  public downloadFile = handleErrorAsync(async (req: Request, res: Response) => {
    if (!req.params.path) throw new BadRequest('File path should be specified as path parameter');
    if (config.STORAGE_TYPE === 'local')
      return res.download(path.resolve(config.PATH_TO_UPLOAD_FILES, req.params.path));
    if (config.STORAGE_TYPE === 's3') return await this.service.s3DownloadFile(req, res);
  });

  public override delete = handleErrorAsync(async (req: Request, res: Response) => {
    if (!req.params.id) throw new BadRequest('Id is required');
    let id: string | number = req.params.id.toString();

    if (!isNaN(+id)) id = +id;
    await this.service.delete(id);
    return res.status(200).json({ id });
  });
}

export const contentController = new ContentController(
  contentSvc,
  createContentBody,
  updateContentBody,
  undefined,
  querySchema,
);
