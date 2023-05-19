import { scheduleController } from './Schedule.controller';
import { BaseRoute } from '@lib/BaseClasses/BaseRoute';

const routes = new BaseRoute(scheduleController);
routes.setRoutes({});

export default routes.router;
