import asyncErrorHandler from "../middlewares/errorHandlers/asyncErrorHandler.js";
import paymentServices from "../services/paymentServices.js"
const payment = asyncErrorHandler(async (req, res) => {
    let userId = req.userInfo.id;
    let { orderId, method, transactionId } = req.body
    const paymentDetails = await paymentServices.payment(orderId, method, transactionId);
    res.status(paymentDetails.status).json(paymentDetails)
})
export default { payment };