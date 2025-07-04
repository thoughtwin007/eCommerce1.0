import CustomError from "../middlewares/errorHandlers/customErrorHandler.js";
import Order from "../models/orderModel.js";
import redis from "../utils/redis.js"
const getOrderById = async (orderId) => {
    const orderDetails = await Order.findById(orderId)
    if (!orderDetails) throw new CustomError("no order found for this orderId", 404)
    return {
        status: 200,
        orderDetails
    }
}
const getOrders = async (userId, role) => {
    let allOrdersRawData = await redis.get('allOrders');
    allOrders = JSON.parse(allOrdersRawData)
    if (!allOrders) {
        allOrders = await Order.find().populate({ path: 'buyerId', select: "_id" }).populate({ path: "items.productId", select: "_id sellerId" });
        var filteredOrders = allOrders.filter((el) => {
            if (role === "buyer") return String(el.buyerId._id) === userId;
            else {
                let tempArr = el.items.filter((ell) => {
                    console.log('sellerId:', ell.productId.sellerId)
                    return String(ell.productId.sellerId) === userId
                })
                return tempArr.length > 0
            }
        })
        await redis.set('allOrders', JSON.stringify(filteredOrders))
        allOrders = filteredOrders;
    }
    return {
        status: 200,
        allOrders
    }
}
const cancelOrder = async (orderId, userId, role, reason) => {
    const order = await Order.findById(orderId).populate('items.productId');
    if (!order) throw new CustomError('no order found for this Id', 404)
    const cancelReason = reason || null


    if (!order.status === "cancelled" || !order.status === "dispatched") {
        if (role != "seller") {
            if (order.buyerId != userId) throw new CustomError("this order doesn't belongs to you", 400)
            const cancelledOrder = await Order.findByIdAndUpdate(orderId, { status: "cancelled", cancelledBy: userId, cancelReason })
            await redis.del('allOrders')
            return {
                status: 200,
                msg: "order Cancelled",
                cancelledOrder
            }
        }
        else {
            for (let el of order.items) {
                if (String(el.productId.sellerId) === userId) {
                    var cancelledProductId = el.productId._id;
                    console.log("el: ", el)
                    var discountFactor = (order.discountAmount / order.orignalAmount);
                    console.log(`discountFactor:${discountFactor}`)
                    var refundedAmount = (el.quantity * el.productId.price) - (el.quantity * el.productId.price * discountFactor)
                    var cancelledOrderInfo = await Order.findByIdAndUpdate(orderId, { status: "partiallyCancelled", cancelledBy: userId, cancelReason })
                    var OrderId = cancelledOrderInfo._id
                    break;
                }
            }
            await redis.del('allOrders')
            return {
                status: 200,
                refundedAmount,
                cancelledProductId,
                OrderId
            };
        }
    } else if (order.status === 'cancelled') throw new CustomError('this order has already been cancelled', 400); else throw new CustomError("order can't be cancel as it has already been dispatched", 400)
}

export default { getOrderById, getOrders, cancelOrder }