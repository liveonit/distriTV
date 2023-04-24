import { Router } from 'express';
import { authSvc } from '../Auth/AuthService';
import { scheduleController } from './Schedule.controller';
/**
 * Api permite leer y manipular datos de usuarios
 */
const router = Router();

/**
 * Devuelve una lista de usuarios
 */
router.get('/', authSvc.authRequiredMiddleware([]), scheduleController.getMany);

/**
 * Devuelve un usuario según su ID
 */
router.get('/:id', authSvc.authRequiredMiddleware([]), scheduleController.getById);


router.get('/tvCode/:id', authSvc.authRequiredMiddleware([]), scheduleController.getByTVcode);

/**
 * Crea un nuevo usuario
 */
router.post('/', authSvc.authRequiredMiddleware(['admin']), scheduleController.create);
/*
 * Actualiza los datos de un usuario. Este endpoint también se encarga de la gestión
 * de su contraseña.
 */
router.put('/:id', authSvc.authRequiredMiddleware(['admin']), scheduleController.update);

/*
 * Elimina un usuario
 */
router.delete('/:id', authSvc.authRequiredMiddleware(['admin']), scheduleController.delete);

export default router;
