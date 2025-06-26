import token from "../../utils/accesToken/token.js";
import CustomError from "./customErrorHandler.js";
const islogedin = async (req, res, next) => {
    if (!req.headers.authorization) throw new CustomError("token not found", 404)
    let headToken = req.headers.authorization.split(' ')[1].trim()
    let decodedData = token.verifyToken(headToken)
    req.userInfo = decodedData;
    next();
}
const isAuthorized = async (req, res, next) => {
    console.log("reqInfo:", req.userInfo)
    if ((req.userInfo.role === "seller")) next();
    else throw new CustomError('you are not authorized for this path', 400)
}
export default { islogedin, isAuthorized }
//