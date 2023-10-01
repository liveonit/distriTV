import { alertController } from './Alert.controller';
import { BaseRoute } from 'lib/BaseClasses/BaseRoute';
import { authSvc } from '../Auth/AuthService';

const routes = new BaseRoute(alertController, authSvc);
routes.setRoutes({});

export default routes.router;
