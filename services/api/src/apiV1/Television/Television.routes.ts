import { authSvc } from '@src/apiV1/Auth/AuthService';
import { Router } from 'express';
import { televisionController } from './Television.controller';
import { BaseRoute } from '@lib/BaseClasses/BaseRoute';

const routes = new BaseRoute(televisionController);
routes.setRoutes({});
routes.router.post('/:tvCode/schedules', televisionController.getByTVcode, );
export default routes.router;
