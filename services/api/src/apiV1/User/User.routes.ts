import { BaseRoute } from 'lib/BaseClasses/BaseRoute';
import { authSvc } from '../Auth/AuthService';
import { userController } from './User.controller';

const routes = new BaseRoute(userController, authSvc);
routes.setRoutes({
  getById: { enabled: true, path: '/:id', requiredRoles: ['admin'] },
  getMany: { enabled: true, path: '/', requiredRoles: ['admin'] },
  create: { enabled: true, path: '/', requiredRoles: ['admin'] },
  update: { enabled: true, path: '/:id', requiredRoles: ['admin'] },
});
export default routes.router;
