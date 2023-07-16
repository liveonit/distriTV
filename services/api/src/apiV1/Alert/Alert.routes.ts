import { alertController } from './Alert.controller';
import { BaseRoute } from '@lib/BaseClasses/BaseRoute';

const routes = new BaseRoute(alertController);
routes.setRoutes({});

export default routes.router;
