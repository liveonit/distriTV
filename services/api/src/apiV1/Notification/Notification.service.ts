import { Notification } from '@src/entities/Notification';
import { BaseService } from '@src/utils/BaseClasses/BaseService';

class NotificationSvc extends BaseService<Notification> {}

export const notificationSvc = new NotificationSvc(Notification);
