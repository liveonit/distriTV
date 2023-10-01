import { televisionController } from './Television.controller';
import { BaseRoute } from 'lib/BaseClasses/BaseRoute';
import { authSvc } from '../Auth/AuthService';

const routes = new BaseRoute(televisionController, authSvc);
routes.setRoutes({});
routes.router.post('/:tvCode/schedules', televisionController.getByTVcode);
export default routes.router;
