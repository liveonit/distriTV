import { BaseRoute } from '@src/lib/BaseClasses/BaseRoute';
import { userController } from './User.controller';

const routes = new BaseRoute(userController);
routes.setRoutes({
  getById: { enabled: true, path: '/:id', requiredRoles: ['admin'] },
  getMany: { enabled: true, path: '/:id', requiredRoles: ['admin'] },
});
export default routes.router;
