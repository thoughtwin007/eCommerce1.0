import CustomError from "../middlewares/errorHandlers/customErrorHandler.js"
import Order from "../models/orderModel.js"
import Payment from "../models/paymentModel.js"

const payment = async (orderId, method) => {
    let orderDetails = await Order.findById(orderId)
    if (!orderDetails) throw new CustomError("order Not found for this Id ", 404)
    orderDetails = await Order.findByIdAndUpdate(orderId, { status: confirmed }, { new: true })

    let amount = orderDetails.totalAmount;
    const order = await Payment.create({
        orderId,
        amount,
        method
    })
    return {
        paymentId: order._id,
        status: "success"
        , orderStatus: order.status,
        msg: 'payment completed succssfully '
    }
}
export default payment;