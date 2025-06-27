import { Router } from "express";
import authUser from "../middlewares/errorHandlers/authUser.js";
import couponController from "../controllers/couponController.js";
const router = Router();
router.route('/').post(authUser.islogedin, authUser.isAuthorized, couponController.createCoupon)
router.route('/').get(authUser.islogedin, authUser.isAuthorized, couponController.getAllCoupons)
router.route('/:id').get(authUser.islogedin, couponController.getCouponById)
router.route('/:id').put(authUser.islogedin, authUser.isAuthorized, couponController.updateCoupon)
router.route('/:id').delete(authUser.islogedin, authUser.isAuthorized, couponController.deleteCoupon)
export default router;


