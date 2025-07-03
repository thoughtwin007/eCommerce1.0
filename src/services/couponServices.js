import CustomError from "../middlewares/errorHandlers/customErrorHandler.js";
import Coupon from "../models/couponModel.js";
import redis from "../utils/redis.js";

const createCoupon = async (sellerId, couponData) => {
    const coupon = new Coupon({ sellerId, ...couponData });
    await coupon.save();
    return {
        status: true,
        coupon
    }
};

const getAllCoupons = async () => {
    let coupons = JSON.parse(await redis.get('coupons'))
    if (!coupons) {
        coupons = await Coupon.find({ deletedAt: { $eq: null } });
        await redis.set("coupons", JSON.stringify(coupons))
    }
    return {
        status: true,
        coupons
    }
};
const getCouponById = async (id) => {
    const coupon = await Coupon.findById(id);
    if (!coupon || coupon.deletedAt) throw new CustomError("coupon not found", 404)
    return {
        status: true,
        coupon
    }
};

const updateCoupon = async (sellerId, id, updateData) => {
    const chkSeller = await Coupon.findById(id)
    if (!chkSeller) throw new CustomError("coupon not found", 404)
    console.log("chksellerId and sellerId", chkSeller.sellerId, ' ', sellerId)
    if (chkSeller.sellerId != sellerId) throw new CustomError("this coupon doesnot belongs to you", 400)
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });
    await redis.del('coupons')
    return {
        status: true,
        updatedCoupon
    }
};

const deleteCoupon = async (sellerId, id) => {
    const chkSeller = await Coupon.findById(id)
    if (!(chkSeller.sellerId === sellerId)) throw new CustomError("coupon created by other user", 400)
    if (!chkSeller) throw new CustomError('coupon not found', 404)
    let deletedCouponId = await Coupon.findByIdAndDelete(id).select('_id');
    return {
        status: true,
        deletedCouponId,
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
