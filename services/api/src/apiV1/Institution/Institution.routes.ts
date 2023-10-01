import { institutionController } from './Institution.controller';
import { BaseRoute } from 'lib/BaseClasses/BaseRoute';
import { authSvc } from '../Auth/AuthService';

const routes = new BaseRoute(institutionController, authSvc);
routes.setRoutes({});
export default routes.router;
