import { authSvc } from '@src/apiV1/Auth/AuthService';
import { Router } from 'express';
import { contentController } from './Content.controller';
import fileUpload from 'express-fileupload';
/**
 * Api permite leer y manipular datos de usuarios
 */
const router = Router();

/**
 * Devuelve una lista de usuarios
 */
router.get('/', authSvc.authRequiredMiddleware([]), contentController.getMany);

/**
 * Devuelve un usuario según su ID
 */
router.get('/:id', authSvc.authRequiredMiddleware([]), contentController.getById);
/**
 * Crea un nuevo usuario
 */
router.post('/', authSvc.authRequiredMiddleware(['admin']), contentController.create);
/*
 * Actualiza los datos de un usuario. Este endpoint también se encarga de la gestión
 * de su contraseña.
 */
router.put('/:id', authSvc.authRequiredMiddleware(['admin']), contentController.update);

/*
 * Elimina un usuario
 */
router.delete('/:id', authSvc.authRequiredMiddleware(['admin']), contentController.delete);

/*
 * Elimina un usuario
 */
router.post(
  '/upload',
  contentController.uploadFiles,
);

router.get('/download/:path', contentController.downloadFile);

export default router;
