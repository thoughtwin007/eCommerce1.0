import { Router } from "express";
import paymentController from "../controllers/paymentController.js";
import authUser from "../middlewares/errorHandlers/authUser.js";
const router = Router();
router.route('/').post(authUser.islogedin, paymentController.payment)
// router.route('/:id').get(authUser.islogedin, paymentController.payment)

export default router;
