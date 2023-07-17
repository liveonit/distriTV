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
  public getByTVcode = handleErrorAsync(async (req: Request, res: Response) => {
    const tvCode: string = req.params.tvCode;
    const durationLeft: number = req.body.alertDurationLeft;
    if (tvCode.length !== 6) {
      throw new BadRequest('tvCode should be 6 char long');
    }

    try {
      const response = await this.service.getByTVcode(tvCode, durationLeft)
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
