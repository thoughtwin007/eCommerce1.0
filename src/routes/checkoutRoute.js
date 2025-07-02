import { Router } from "express";
import checkout from "../controllers/checkoutController.js";
import authUser from "../middlewares/errorHandlers/authUser.js";
const router = Router();
router.route('/').post(authUser.islogedin, authUser.isAuthorized("buyer"), checkout)

export default router;
