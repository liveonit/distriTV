import { Alert } from '@src/entities/Alert';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { AlertSvc, alertSvc } from './Alert.service';
import { createAlertBody } from './types/CreateAlertBody';
import { updateAlertBody } from './types/UpdateAlertBody';
import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import { Request, Response } from 'express';


class AlertController extends BaseController<Alert, AlertSvc> { 
  public override create = handleErrorAsync(async (req: Request, res: Response) => {

    return res.status(200).json(await this.service.createAlerts(req.body));
  });
}

export const alertController = new AlertController(
  alertSvc,
  createAlertBody,
  updateAlertBody,
  undefined,
  querySchema,
);
