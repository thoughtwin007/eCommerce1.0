import { response } from "express";
import CustomError from "../middlewares/errorHandlers/customErrorHandler.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

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
        return String(el.items.productId.sellerId) === userId
    })
    return {
        status: 200,
        roleBasedOrders
    }
}
const cancelOrder = async (orderId, userId, role, reason) => {
    const order = await Order.findById(orderId).populate('items.productId');
    const cancelReason = reason || null
    if (role != "seller") {
        if (order.buyerId != userId) throw new CustomError("this order doesn't belongs to you", 400)
        const cancelledOrder = await Order.findByIdAndUpdate(orderId, { status: "cancelled", cancelledBy: userId, cancelReason })
        if (!cancelledOrder) throw new CustomError('no order found for this Id', 404)
        return {
            status: 200,
            msg: "order Cancelled",
            cancelledOrder
        }
    }
    else {
        for (el of order.items) {
            if (el.productId.sellerId === userId) {
                var productId = el.productId;
                var discountFactor = (order.discountAmount / order.totalAmount) * 100
                var refundedAmount = (el.quantity * el.productId.price) * discountFactor
                var cancelledOrder = await Order.findByIdAndUpdate(orderId, { status: "partiallyCancelled", cancelledBy: userId, cancelReason })
                break;
            }
        }
        return {
            productId,
            refundedAmount,
            cancelledOrder
        };
    }
}

export default { getOrderById, getOrders, cancelOrder }