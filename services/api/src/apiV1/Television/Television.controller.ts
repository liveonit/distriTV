import { Television } from '@src/entities/Television';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { TelevisionSvc, televisionSvc } from './Television.service';
import { createTelevisionBody } from './types/CreateTelevisionBody';
import { updateTelevisionBodySchema } from './types/UpdateTelevisionBody';
import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import { BadRequest, NotFound } from '@lib/errors';
import { Request, Response } from 'express';

class TelevisionController extends BaseController<Television, TelevisionSvc> {
  public override create = handleErrorAsync(async (req: Request, res: Response) => {
    const body = this.createSchema?.parse(req.body) || req.body;
    const { relations } = this.querySchema?.parse(req.query) || {};
    let result: any = await this.service.createWithMonitor(body, { relations });
    if (this.responseSchema) result = this.responseSchema.parse(result);
    return res.status(200).json(result);
  });

  public getByTVcode = handleErrorAsync(async (req: Request, res: Response) => {
    const tvCode: string = req.params.tvCode;

    if (tvCode.length !== 6) {
      throw new BadRequest('tvCode should be 6 char long');
    }

    try {
      const response = await this.service.getByTVcode(tvCode, req.body);
      return res.status(200).json(response);
    } catch (e) {
      throw new NotFound(String(e));
    }
  });
}

export const televisionController = new TelevisionController(
  televisionSvc,
  createTelevisionBody,
  updateTelevisionBodySchema,
  undefined,
  querySchema,
);
