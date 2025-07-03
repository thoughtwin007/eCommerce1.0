import couponServices from "../services/couponServices.js";
import asyncErrorHandler from "../middlewares/errorHandlers/asyncErrorHandler.js";
const createCoupon = asyncErrorHandler(async (req, res) => {
    let sellerId = req.userInfo.id;
    const couponInfo = await couponServices.createCoupon(sellerId, req.body);
    res.status(200).json(couponInfo);
});

const getAllCoupons = asyncErrorHandler(async (req, res) => {
    const couponInfo = await couponServices.getAllCoupons();
    res.status(200).json(couponInfo);
});

const getCouponById = asyncErrorHandler(async (req, res) => {
    const couponInfo = await couponServices.getCouponById(req.params.id);
    res.status(200).json(couponInfo);
});

const updateCoupon = asyncErrorHandler(async (req, res) => {
    let sellerId = req.userInfo.id;
    const updatedCoupon = await couponServices.updateCoupon(sellerId, req.params.id, req.body);
    res.status(200).json(updatedCoupon);
});

const deleteCoupon = asyncErrorHandler(async (req, res) => {
    let sellerId = req.userInfo.id
    const deletedCoupon = await couponServices.deleteCoupon(sellerId, req.params.id);
    res.status(200).json(deletedCoupon);
});

export default {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon
};
