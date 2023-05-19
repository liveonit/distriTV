import { Notification } from '@src/entities/Notification';
import { BaseService } from '@lib/BaseClasses/BaseService';

export class NotificationSvc extends BaseService<Notification> {}

export const notificationSvc = new NotificationSvc(Notification);
