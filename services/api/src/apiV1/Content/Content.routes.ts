import { contentController } from './Content.controller';
import { BaseRoute } from 'lib/BaseClasses/BaseRoute';
import { authSvc } from '../Auth/AuthService';

const routes = new BaseRoute(contentController, authSvc);
routes.setRoutes({});

routes.router.post('/upload', contentController.uploadFiles);
routes.router.get('/download/:path', contentController.downloadFile);

export default routes.router;
