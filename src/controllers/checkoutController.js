import asyncErrorHandler from "../middlewares/errorHandlers/asyncErrorHandler.js";
import checkoutService from "../services/checkoutServices.js"
const checkout = asyncErrorHandler(async (req, res) => {
    console.log('entered in checkout controller')
    let userId = req.userInfo.id
    let code = req.query.code
    let info = await checkoutService(userId, code)
    res.json({
        info,
        msg: "checked out "
    })
})
export default checkout;