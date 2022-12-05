import { authSvc } from '@src/services/auth';
import { Router } from 'express';
import { authorController } from './User.controller';

/**
 * Api permite leer y manipular datos de usuarios
 */
const router = Router();

/**
 * Devuelve una lista de usuarios
 */
router.get('/', authSvc.authRequiredMiddleware(['admin']), authorController.getMany);

/**
 * Lee los datos del usuario autenticado
 */
router.get('/me', authSvc.authRequiredMiddleware([]), authorController.getProfile);

/**
 * Lee los datos del usuario autenticado
 */
router.put('/me', authSvc.authRequiredMiddleware([]), authorController.updateProfile);

/**
 * Devuelve un usuario según su ID
 */
router.get('/:id', authSvc.authRequiredMiddleware(['admin']), authorController.getById);
/**
 * Crea un nuevo usuario
 */
router.post('/', authSvc.authRequiredMiddleware(['admin']), authorController.create);
/*
 * Actualiza los datos de un usuario. Este endpoint también se encarga de la gestión
 * de su contraseña.
 */
router.put('/:id', authSvc.authRequiredMiddleware(['admin']), authorController.update);

/*
 * Elimina un usuario
 */
router.delete('/:id', authSvc.authRequiredMiddleware(['admin']), authorController.delete);

/*
 * Elimina el usuario autenticado
 */
router.delete('/', authSvc.authRequiredMiddleware([]), authorController.deleteMe);

/**
 * Authenticate local user
 */
router.post('/login', authorController.localLogin);

/**
 * Authenticate google user
 */
 router.post('/googlelogin', authorController.googleLogin);

/**
 * Finalizar sesion de usuario
 */
router.post('/logout', authSvc.authRequiredMiddleware([]), authorController.logout);

/**
 * Finalizar sesion de usuario
 */
router.post('/refresh-token', authorController.refreshToken);

export default router;
