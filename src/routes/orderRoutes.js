import { Router } from "express";
import orderController from "../controllers/orderController.js";
import authUser from "../middlewares/errorHandlers/authUser.js";
const router = Router();
router.route('/').get(authUser.islogedin, orderController.getOrders)

export default router;
