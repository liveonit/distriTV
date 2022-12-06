import { Notification } from "@src/entities/Notification";
import BaseController from "@src/utils/BaseClasses/BaseController";
import { querySchema } from "@src/utils/BaseClasses/QueryType";
import { notificationSvc } from "./Notification.service";
import { createNotificationBody } from "./types/CreateNotificationBody";
import { updateNotificationBodySchema } from "./types/UpdateNotificationBody";

class NotificationController extends BaseController<Notification> {}

export const notificationController = new NotificationController(notificationSvc, createNotificationBody, updateNotificationBodySchema, undefined, querySchema)
