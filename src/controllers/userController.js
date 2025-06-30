import asyncErrorHandler from "../middlewares/errorHandlers/asyncErrorHandler.js"
import userServices from "../services/userService.js"
const register = asyncErrorHandler(async (req, res, next) => {

    console.log("register controller provoked:", req.body)

    let info = await userServices.registerUser(req.body)

    // console.log("info from register controller:", info)
    if (info.deletedAt)
        res.status(204).json(info)
    res.status(200).json(info)
})

const login = asyncErrorHandler(async (req, res, next) => {
    let info = await userServices.loginUser(req.body)
    res.status(info.status).json(info)
})
export default { register, login }