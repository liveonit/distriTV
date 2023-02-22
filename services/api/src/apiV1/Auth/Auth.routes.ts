import { authSvc } from '@src/apiV1/Auth/AuthService';
import { Router } from 'express';
import { userController } from './Auth.controller';

/**
 * Api permite leer y manipular datos de usuarios
 */
const router = Router();

/**
 * Lee los datos del usuario autenticado
 */
router.get('/me', authSvc.authRequiredMiddleware([]), userController.getProfile);

/**
 * Lee los datos del usuario autenticado
 */
router.put('/me', authSvc.authRequiredMiddleware([]), userController.updateProfile);

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
