import { authSvc } from '@src/apiV1/Auth/AuthService';
import { Router } from 'express';
import { roleController } from './Role.controller';

/**
 * Api permite leer y manipular datos de usuarios
 */
const router = Router();

/**
 * Devuelve una lista de usuarios
 */
router.get('/', authSvc.authRequiredMiddleware([]), roleController.getMany);

/**
 * Devuelve un usuario según su ID
 */
router.get('/:id', authSvc.authRequiredMiddleware([]), roleController.getById);
/**
 * Crea un nuevo usuario
 */
router.post('/', authSvc.authRequiredMiddleware(['admin']), roleController.create);
/*
 * Actualiza los datos de un usuario. Este endpoint también se encarga de la gestión
 * de su contraseña.
 */
router.put('/:id', authSvc.authRequiredMiddleware(['admin']), roleController.update);

/*
 * Elimina un usuario
 */
router.delete('/:id', authSvc.authRequiredMiddleware(['admin']), roleController.delete);

export default router;
