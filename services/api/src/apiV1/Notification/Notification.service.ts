import { Notification } from 'validation/entities/Notification';
import { BaseService } from 'lib/BaseClasses/BaseService';
import { db } from '@src/db';

export class NotificationSvc extends BaseService<Notification> {}

export const notificationSvc = new NotificationSvc(Notification, db);
