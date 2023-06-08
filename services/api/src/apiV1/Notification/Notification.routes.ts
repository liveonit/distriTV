import { notificationController } from './Notification.controller';
import { BaseRoute } from '@lib/BaseClasses/BaseRoute';

const routes = new BaseRoute(notificationController);
routes.setRoutes({});
export default routes.router;
