import { Alert } from '@src/entities/Alert';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { AlertSvc, alertSvc } from './Alert.service';
import { createAlertBody } from './types/CreateAlertBody';
import { updateAlertBody } from './types/UpdateAlertBody';

class AlertController extends BaseController<Alert, AlertSvc> { }

export const alertController = new AlertController(
  alertSvc,
  createAlertBody,
  updateAlertBody,
  undefined,
  querySchema,
);
