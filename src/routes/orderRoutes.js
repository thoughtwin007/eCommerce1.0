import { Router } from "express";
import orderController from "../controllers/orderController.js";
import authUser from "../middlewares/errorHandlers/authUser.js";
const router = Router();
router.route('/').get(authUser.islogedin, orderController.getOrders)
router.route('/:id').get(authUser.islogedin, authUser.isAuthorized('buyer'), orderController.getOrderById)
router.route('/:id/cancel').patch(authUser.islogedin, orderController.cancelOrder)
export default router;
