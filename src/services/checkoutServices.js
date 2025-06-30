import CustomError from "../middlewares/errorHandlers/customErrorHandler.js";
import Cart from "../models/cart.js"
import Coupon from "../models/couponModel.js";
import Order from "../models/orderModel.js";
const validateCoupon = (couponDetails) => {
    if (!couponDetails) throw new CustomError('coupon is invalid', 404);
    let todayDate = Date.now();
    if (todayDate > couponDetails.validTill || todayDate < couponDetails.validFrom) throw new CustomError('coupon validity expired or coupon may have not been activated now', 400)
}
const checkout = async (userId, cartId, couponCode) => {
    const allItems = await Cart.findById(cartId).populate('items.productId');
    if (!allItems) throw new CustomError('cart is empty')
    if (allItems.userId != userId) throw new CustomError('this cart belongs to another user', 400)
    const couponDetails = await Coupon.findOne({ code: couponCode })
    validateCoupon(couponDetails)
    let orignalAmount = 0;
    let items = allItems.items.map((item) => {
        orignalAmount += item.productId.price * item.quantity;
        return { ...item, priceAtPurchase: item.productId.price }
    })
    let discountAmount = (orignalAmount * couponDetails.discount) / 100
    let payableAmount = orignalAmount - (orignalAmount * couponDetails.discount) / 100
    const newOrder = await Order.create({ buyerId: allItems.userId, items, couponCode, discountAmount, orignalAmount, totalAmount: payableAmount })
    await Cart.findByIdAndDelele(all.items._id)
    return {
        order: newOrder._id,
        payableAmount,
        orignalAmount,
        discountApplied: discountAmount,
        paymentOption: ['upi', 'card', 'cod']
    }
}
export default checkout