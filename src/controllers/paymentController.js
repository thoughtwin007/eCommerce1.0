import asyncErrorHandler from "../middlewares/errorHandlers/asyncErrorHandler.js";
import paymentServices from "../services/paymentServices.js"
const payment = asyncErrorHandler(async (req, res) => {
    let userId = req.userInfo.id;
    let { orderId, method } = req.body
    const paymentDetails = await paymentServices.payment(orderId, method);
    res.status(paymentDetails.status).json(paymentDetails)
})
export default { payment };