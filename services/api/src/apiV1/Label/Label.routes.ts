import { labelController } from './Label.controller';
import { BaseRoute } from '@lib/BaseClasses/BaseRoute';

const routes = new BaseRoute(labelController);
routes.setRoutes({});
export default routes.router;
