import { authSvc } from '@src/apiV1/Auth/AuthService';
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
 * Devuelve una tv con todas sus agendas
 */
// TODO: Temporalmente se deshabilita la autenticacion para probar desde la app android 
router.get('/:tvCode/schedules', televisionController.getByTVcode, );

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
