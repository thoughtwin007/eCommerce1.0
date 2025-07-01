import asyncErrorHandler from "../middlewares/errorHandlers/asyncErrorHandler.js"
import userServices from "../services/userService.js"
const register = asyncErrorHandler(async (req, res, next) => {
    console.log("register controller provoked:", req.body)
    let info = await userServices.registerUser(req.body)
    if (info.deletedAt)
        res.status(204).json(info)
    res.status(200).json(info)
})
const registerWithoutRecover = asyncErrorHandler(async (req, res) => {
    const data = await userServices.registerWithOutRecover()
    res.status(201), json(data)
})
const recoverAccount = asyncErrorHandler(async (req, res) => {
    let { password, email, name } = req.body;
    let data = await userServices.registerAndRecover(email, password, name)
    res.status(200).json(data)
})
const login = asyncErrorHandler(async (req, res, next) => {
    let info = await userServices.loginUser(req.body)
    res.status(info.status).json(info)
})
export default { register, login, recoverAccount }