import User from "../../models/userModel.js";
import token from "../../utils/token.js";
import CustomError from "./customErrorHandler.js";
const islogedin = async (req, res, next) => {
    if (!req.headers.authorization) throw new CustomError("token not found", 404)
    let headToken = req.headers.authorization.split(' ')[1].trim()
    let decodedData = token.verifyToken(headToken)
    let user = await User.findById(decodedData.id)
    if (user.deletedAt) throw new CustomError("your account doesn't exist", 404)
    req.userInfo = decodedData;
    next();
}
const isAuthorized = (desiredRole) => {
    return async (req, res, next) => {
        if (desiredRole != req.userInfo.role) throw new CustomError('you are not authorized for this path', 400)
        next();
    }
}
export default { islogedin, isAuthorized }
//