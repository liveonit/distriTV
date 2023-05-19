import { Notification } from '@src/entities/Notification';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { NotificationSvc, notificationSvc } from './Notification.service';
import { createNotificationBody } from './types/CreateNotificationBody';
import { updateNotificationBodySchema } from './types/UpdateNotificationBody';

class NotificationController extends BaseController<Notification, NotificationSvc> { }

export const notificationController = new NotificationController(
  notificationSvc,
  createNotificationBody,
  updateNotificationBodySchema,
  undefined,
  querySchema,
);
