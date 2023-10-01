import { notificationController } from './Notification.controller';
import { BaseRoute } from 'lib/BaseClasses/BaseRoute';
import { authSvc } from '../Auth/AuthService';

const routes = new BaseRoute(notificationController, authSvc);
routes.setRoutes({});
export default routes.router;
