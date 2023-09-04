import { Notification } from '@src/entities/Notification';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { NotificationSvc, notificationSvc } from './Notification.service';
import { createNotificationBody } from 'validation/src';
import { updateNotificationBodySchema } from 'validation/src';

class NotificationController extends BaseController<Notification, NotificationSvc> { }

export const notificationController = new NotificationController(
  notificationSvc,
  createNotificationBody,
  updateNotificationBodySchema,
  undefined,
  querySchema,
);
