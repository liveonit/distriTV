import { labelController } from './Label.controller';
import { BaseRoute } from 'lib/BaseClasses/BaseRoute';
import { authSvc } from '../Auth/AuthService';

const routes = new BaseRoute(labelController, authSvc);
routes.setRoutes({});
export default routes.router;
