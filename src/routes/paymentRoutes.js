import { Router } from "express";
import 
const router = Router();
router.route('/register').post(userController.register)
router.route('/login').post(userController.login)
export default router;
