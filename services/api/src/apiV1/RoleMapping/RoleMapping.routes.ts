import { roleMappingController } from './RoleMapping.controller';
import { BaseRoute } from '@src/lib/BaseClasses/BaseRoute';

const routes = new BaseRoute(roleMappingController);
routes.setRoutes({
  getById: { enabled: true, path: '/:id', requiredRoles: ['admin'] },
  getMany: { enabled: true, path: '/:id', requiredRoles: ['admin'] },
});
export default routes.router;
