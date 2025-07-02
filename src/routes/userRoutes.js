import { Router } from "express";
import userController from "../controllers/userController.js";
import authUser from "../middlewares/errorHandlers/authUser.js";
const router = Router();
router.route('/register').post(userController.register)
router.route('/login').post(userController.login)
router.route('/recoverAccount').patch(userController.recoverAccount)
router.route('/reciverAccount').post(userController.registerWithoutRecover)
router.route('/delete').delete(authUser.islogedin, userController.deleteAccount)
export default router;
