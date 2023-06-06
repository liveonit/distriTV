import { contentController } from './Content.controller';
import { BaseRoute } from '@lib/BaseClasses/BaseRoute';

const routes = new BaseRoute(contentController);
routes.setRoutes({});

routes.router.post('/upload', contentController.uploadFiles);
routes.router.get('/download/:path', contentController.downloadFile);

export default routes.router;
