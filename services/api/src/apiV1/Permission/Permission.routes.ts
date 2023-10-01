import { permissionController } from './Permission.controller';
import { BaseRoute } from 'lib/BaseClasses/BaseRoute';

const routes = new BaseRoute(permissionController);
routes.setRoutes({
  getById: { enabled: true, path: '/:id', requiredRoles: ['admin'] },
  getMany: { enabled: true, path: '/:id', requiredRoles: ['admin'] },
});
export default routes.router;
