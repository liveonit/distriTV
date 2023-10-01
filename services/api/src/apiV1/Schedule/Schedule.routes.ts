import { scheduleController } from './Schedule.controller';
import { BaseRoute } from 'lib/BaseClasses/BaseRoute';
import { authSvc } from '../Auth/AuthService';

const routes = new BaseRoute(scheduleController, authSvc);
routes.setRoutes({});

export default routes.router;
