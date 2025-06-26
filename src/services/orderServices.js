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
    const allOrders = await Order.find().populate('buyerId');
    console.log(userId)
    const roleBasedOrders = allOrders.filter((el) => {
        return String(el.buyerId._id) === userId
    })
    return {
        status: 200,
        roleBasedOrders
    }
}

export default { getOrderById, getOrders }