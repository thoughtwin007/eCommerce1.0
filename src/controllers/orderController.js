import asyncErrorHandler from "../middlewares/errorHandlers/asyncErrorHandler.js";
import orderServices from "../services/orderServices.js";
const getOrderById = asyncErrorHandler(async (req, res) => {
    const orderDetails = await orderServices.getOrderById(req.params.id)
    res.status(orderDetails.status).json(orderDetails)
})
const getOrders = async (req, res) => {
    const roleBasedOrders = await orderServices.getOrders(req.userInfo.id)
    res.status(roleBasedOrders.status).json(roleBasedOrders)
}

export default { getOrderById, getOrders }