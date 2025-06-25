import CustomError from "../middlewares/errorHandlers/customErrorHandler.js";
import Coupon from "../models/couponModel.js";

const createCoupon = async (couponData) => {
    const coupon = new Coupon(couponData);
    await coupon.save();
    return {
        status: 200,
        coupon
    }
};

const getAllCoupons = async () => {
    const coupons = await Coupon.find();
    return {
        status: 200,
        coupons
    }
};
const getCouponById = async (id) => {
    const coupon = await Coupon.findById(id);
    if (!coupon) throw new CustomError("coupon not found", 404)
    return {
        status: 200,
        coupon
    }
};

const updateCoupon = async (id, updateData) => {
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });
    if (!updateCoupon) throw new CustomError("coupon not found", 404)
    return {
        status: 200,
        updateCoupon
    }
};

const deleteCoupon = async (id) => {
    let deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) throw new CustomError("coupon not found", 404)
    return {
        status: 200,
        msg: "coupon deleted"
    }
};

export default {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon
};
