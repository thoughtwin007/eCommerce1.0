import { Router } from "express";
import authUser from "../middlewares/errorHandlers/authUser.js";
import cartController from "../controllers/cartController.js"
const router = Router();
router.route('/').get(authUser.islogedin, authUser.isAuthorized('buyer'), cartController.getCart)
router.route('/').post(authUser.islogedin, authUser.isAuthorized('buyer'), cartController.addToCart)
router.route('/:productId').delete(authUser.islogedin, cartController.removeItem)
router.route("/:productId").put(authUser.islogedin, cartController.updateCartItem)
export default router;