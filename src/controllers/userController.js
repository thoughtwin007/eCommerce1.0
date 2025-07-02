import asyncErrorHandler from "../middlewares/errorHandlers/asyncErrorHandler.js"
import userServices from "../services/userService.js"
const register = asyncErrorHandler(async (req, res, next) => {
    console.log("register controller provoked:", req.body)
    let info = await userServices.registerUser(req.body)
    console.log("info fro service: ", info)
    if (info.deletedAt) res.status(202).json(info);
    else res.status(200).json(info)
})
const registerWithoutRecover = asyncErrorHandler(async (req, res) => {
    const data = await userServices.registerWithOutRecover()
    res.status(201), json(data)
})
const recoverAccount = asyncErrorHandler(async (req, res) => {
    let { email, password } = req.body;
    let data = await userServices.registerAndRecover(email, password)
    res.status(200).json(data)
})
const login = asyncErrorHandler(async (req, res) => {
    let info = await userServices.loginUser(req.body)
    res.status(info.status).json(info)
})
const deleteAccount = asyncErrorHandler(async (req, res) => {
    let id = req.userInfo.id;
    let deletedData = await userServices.deleteAccount(id)
    res.status(200).json(deletedData)
})
export default { register, login, recoverAccount, registerWithoutRecover, deleteAccount }