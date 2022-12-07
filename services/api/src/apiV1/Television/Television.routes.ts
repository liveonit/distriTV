import { authSvc } from '@src/apiV1/User/AuthService';
import { Router } from 'express';
import { televisionController } from './Television.controller';

/**
 * Api permite leer y manipular datos de usuarios
 */
const router = Router();

/**
 * Devuelve una lista de usuarios
 */
router.get('/', authSvc.authRequiredMiddleware([]), televisionController.getMany);

/**
 * Devuelve un usuario según su ID
 */
router.get('/:id', authSvc.authRequiredMiddleware([]), televisionController.getById);
/**
 * Crea un nuevo usuario
 */
router.post('/', authSvc.authRequiredMiddleware(['admin']), televisionController.create);
/*
 * Actualiza los datos de un usuario. Este endpoint también se encarga de la gestión
 * de su contraseña.
 */
router.put('/:id', authSvc.authRequiredMiddleware(['admin']), televisionController.update);

/*
 * Elimina un usuario
 */
router.delete('/:id', authSvc.authRequiredMiddleware(['admin']), televisionController.delete);

export default router;