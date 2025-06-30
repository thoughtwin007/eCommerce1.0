import CustomError from "../middlewares/errorHandlers/customErrorHandler.js";
import Order from "../models/orderModel.js";

const getOrderById = async (orderId) => {
    const orderDetails = await Order.findById(orderId)
    if (!orderDetails) throw new CustomError("no order found for this orderId", 404)
    return {
        status: 200,
        orderDetails
    }
}
const getOrders = async (userId) => {
    console.log("userID: ", userId)
    const allOrders = await Order.find().populate('buyerId', "items.productId");
    console.log(userId)
    const roleBasedOrders = allOrders.filter((el) => {
        if (el.buyerId.role === "buyer") return String(el.buyerId._id) === userId;
        return string(el.items.productId.sellerId) === userId
    })
    return {
        status: 200,
        roleBasedOrders
    }
}
const cancelOrder = async (orderId, userId, reason) => {
    const cancelReason = reason || null
    const cancelledOrder = await Order.findByIdAndUpdate(orderId, { status: "cancelled", cancelledBy: userId, cancelReason })
    if (!cancelledOrder) throw new CustomError('no order found for this Id', 404)
    return {
        status: 200,
        msg: "order Cancelled",
        cancelledOrder
    }
}

export default { getOrderById, getOrders, cancelOrder }