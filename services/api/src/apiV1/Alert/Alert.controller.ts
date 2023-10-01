import { Alert } from 'validation/entities/Alert';
import { BaseController } from 'lib/BaseClasses/BaseController';
import { querySchema } from 'lib/BaseClasses/QueryType';
import { AlertSvc, alertSvc } from './Alert.service';
import { createAlertBody } from 'validation/entities/Alert';
import { updateAlertBody } from 'validation/entities/Alert';
import { handleErrorAsync } from 'lib/middlewares/errorCatcher';
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
