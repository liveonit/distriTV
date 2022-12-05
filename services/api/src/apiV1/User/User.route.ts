import { authSvc } from '@src/apiV1/User/AuthService';
import { Router } from 'express';
import { userController } from './User.controller';

/**
 * Api permite leer y manipular datos de usuarios
 */
const router = Router();

/**
 * Devuelve una lista de usuarios
 */
router.get('/', authSvc.authRequiredMiddleware(['admin']), userController.getMany);

/**
 * Lee los datos del usuario autenticado
 */
router.get('/me', authSvc.authRequiredMiddleware([]), userController.getProfile);

/**
 * Lee los datos del usuario autenticado
 */
router.put('/me', authSvc.authRequiredMiddleware([]), userController.updateProfile);

/**
 * Devuelve un usuario según su ID
 */
router.get('/:id', authSvc.authRequiredMiddleware(['admin']), userController.getById);
/**
 * Crea un nuevo usuario
 */
router.post('/', authSvc.authRequiredMiddleware(['admin']), userController.create);
/*
 * Actualiza los datos de un usuario. Este endpoint también se encarga de la gestión
 * de su contraseña.
 */
router.put('/:id', authSvc.authRequiredMiddleware(['admin']), userController.update);

/*
 * Elimina un usuario
 */
router.delete('/:id', authSvc.authRequiredMiddleware(['admin']), userController.delete);

/*
 * Elimina el usuario autenticado
 */
router.delete('/', authSvc.authRequiredMiddleware([]), userController.deleteMe);

/**
 * Authenticate local user
 */
router.post('/login', userController.localLogin);

/**
 * Authenticate google user
 */
 router.post('/googlelogin', userController.googleLogin);

/**
 * Finalizar sesion de usuario
 */
router.post('/logout', authSvc.authRequiredMiddleware([]), userController.logout);

/**
 * Finalizar sesion de usuario
 */
router.post('/refresh-token', userController.refreshToken);

export default router;
