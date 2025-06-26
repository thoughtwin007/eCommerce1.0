import CustomError from "../middlewares/errorHandlers/customErrorHandler.js";
import Coupon from "../models/couponModel.js";

const createCoupon = async (sellerId, couponData) => {
    const coupon = new Coupon({ sellerId, ...couponData });
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

const updateCoupon = async (sellerId, id, updateData) => {
    const chkSeller = await Coupon.findById(id)
    console.log("chksellerId and sellerId", chkSeller.sellerId, ' ', sellerId)
    if (chkSeller.sellerId != sellerId) throw new CustomError("this coupon doesnot belongs to you", 400)
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCoupon) throw new CustomError("coupon not found", 404)
    return {
        status: 200,
        updatedCoupon
    }
};

const deleteCoupon = async (sellerId, id) => {
    const chkSeller = await Coupon.findById(id)
    if (!(chkSeller.sellerId === sellerId)) throw new CustomError("this coupon doesnot belongs to you", 400)
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
