import { authSvc } from '@src/apiV1/Auth/AuthService';
import { Router } from 'express';
import { contentController } from './Content.controller';
import fileUpload from 'express-fileupload';
/**
 * Api permite leer y manipular datos de contenidos
 */
const router = Router();

/**
 * Devuelve una lista de contenidos
 */
router.get('/', contentController.getMany, );

/**
 * Devuelve un contenido según su ID
 */
router.get('/:id', authSvc.authRequiredMiddleware([]), contentController.getById);
/**
 * Crea un nuevo contenido
 */
router.post('/', authSvc.authRequiredMiddleware(['admin']), contentController.create);
/*
 * Actualiza los datos de un contenido. Este endpoint también se encarga de la gestión
 * de su contraseña.
 */
router.put('/:id', authSvc.authRequiredMiddleware(['admin']), contentController.update);

/*
 * Elimina un contenido
 */
router.delete('/:id', authSvc.authRequiredMiddleware(['admin']), contentController.delete);

/*
 * Elimina un contenido
 */
router.post(
  '/upload',
  contentController.uploadFiles,
);

router.get('/download/:path', contentController.downloadFile);

export default router;
