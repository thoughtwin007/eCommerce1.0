import asyncErrorHandler from "../middlewares/errorHandlers/asyncErrorHandler.js";
import checkoutService from "../services/checkoutServices.js"
const checkout = asyncErrorHandler(async (req, res) => {
    console.log('entered in checkout controller')
    let cartId = req.params.id
    let userId = req.userInfo.id
    console.log("cartId: ", cartId)
    let code = req.query.code
    console.log('codeQyerry:', code)
    let info = await checkoutService(userId, cartId, code)
    res.json({
        info,
        msg: "checked out "
    })
})
export default checkout;