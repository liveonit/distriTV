import { institutionController } from './Institution.controller';
import { BaseRoute } from '@lib/BaseClasses/BaseRoute';

const routes = new BaseRoute(institutionController);
routes.setRoutes({});
export default routes.router;
