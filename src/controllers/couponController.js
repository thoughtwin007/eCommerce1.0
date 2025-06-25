import couponService from "../services/couponService.js";

const createCoupon = async (req, res) => {
    const couponInfo = await couponService.createCoupon(req.body);
    res.status(couponInfo.status).json(couponInfo);
};

const getAllCoupons = async (req, res) => {
    const couponInfo = await couponService.getAllCoupons();
    res.status(couponInfo.status).json(couponInfo);
};

const getCouponById = async (req, res) => {
    const couponInfo = await couponService.getCouponById(req.params.id);
    res.status(couponInfo.status).json(couponInfo);
};

const updateCoupon = async (req, res) => {
    const updatedCoupon = await couponService.updateCoupon(req.params.id, req.body);
    res.status(updateCoupon.status).json(updatedCoupon);
};

const deleteCoupon = async (req, res) => {
    const deletedCoupon = await couponService.deleteCoupon(req.params.id);
    res.status(deleteCoupon.status).json(deletedCoupon);
};

export default {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon
};
