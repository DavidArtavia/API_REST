import { Router } from 'express';
import { userController } from '../controller/user.controller.js';


const router = Router();

// Rutas de la app que hacen uso de los controladores
router.post('/register', userController.register);
router.post('/login', userController.login);

export default router;


