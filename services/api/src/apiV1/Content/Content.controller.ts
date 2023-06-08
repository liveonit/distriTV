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
    const { files } = req;
    logger.debug({
      name: req.body.name,
      type: req.body.type,
      url: req.body.url,
    });
    if (files && Object.keys(files).length !== 0) {
      const result = await this.service.uploadFiles(files);
      res.json(result);
    } else throw new BadRequest('Files must be provided');
  });

  public downloadFile = handleErrorAsync(async (req: Request, res: Response) => {
    if (!req.params.path) throw new BadRequest('File path should be specified as path parameter');
    res.download(path.resolve(config.PATH_TO_UPLOAD_FILES, req.params.path));
  });

  public override delete = handleErrorAsync(async (req: Request, res: Response) => {
    let id: string | number = req.params.id?.toString();
    if (!id) throw new BadRequest('Id is required');
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
