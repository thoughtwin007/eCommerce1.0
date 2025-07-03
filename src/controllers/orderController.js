import asyncErrorHandler from "../middlewares/errorHandlers/asyncErrorHandler.js";
import orderServices from "../services/orderServices.js";
const getOrderById = asyncErrorHandler(async (req, res) => {
    const orderDetails = await orderServices.getOrderById(req.params.id)
    res.status(orderDetails.status).json(orderDetails)
})
const getOrders = asyncErrorHandler(async (req, res) => {
    const roleBasedOrders = await orderServices.getOrders(req.userInfo.id, req.userInfo.role)
    res.status(roleBasedOrders.status).json(roleBasedOrders)
})
const cancelOrder = asyncErrorHandler(async (req, res) => {
    const { id: userId, role } = req.userInfo;
    const orderId = req.params.id;
    const reason = req.body.reason
    const cancelledOrderData = await orderServices.cancelOrder(orderId, userId, role, reason);
    res.status(cancelledOrderData.status).json(cancelledOrderData)
})
export default { getOrderById, getOrders, cancelOrder }