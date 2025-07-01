import CustomError from "../middlewares/errorHandlers/customErrorHandler.js"
import Product from "../models/productModel.js";
import User from "../models/userModel.js"
import redis from "../utils/redis.js";
import token from "../utils/token.js"
const registerUser = async (info) => {
    console.log("user service invoked:", info);
    await redis.set('name', 'info.name')
    await redis.set('email', 'info.email')
    await redis.set('password', 'info.password')
    const existingUser = await User.findOne({ email: info.email });
    console.log("deletedAt: ", existingUser?.deletedAt)
    if (existingUser) {
        if (existingUser.deletedAt) return {
            msg: 'this account was deleted before, want to continue with your old data',
            deletedAt: existingUser.deletedAt
        }; throw new CustomError("User with this email already exists", 400);
    }
    const newUser = await User.create({ ...info });
    let newToken = token.genToken(newUser)
    return {
        ...newUser.toObject(),
        msg: "User registered successfully",
        newToken
    };
};
const registerWithOutRecover = async () => {
    let email = await redis.get('email')
    let password = await redis.get('password')
    let name = await redis.get('name')
    await User.findOneAndDelete({ email })
    const newUser = await User.create({ email, name, password });
    let newToken = token.genToken(newUser)
    return {
        ...newUser.toObject(),
        msg: "User registered successfully",
        newToken
    };
}
const registerAndRecover = async (email, password, name) => {
    let user = await User.findOne({ email })
    if (!user) throw new CustomError("user with this email doesn't exist", 404)
    if (!user.comparePassword(info.password)) throw new CustomError('incorrect password', 400)
    user = await User.findOneAndUpdate({ email }, { deletedAt: null })
}
const loginUser = async (info) => {
    let user = await User.findOne({ email: info.email })
    if (!user || user.deletedAt) throw new CustomError('user with this email does not exist', 400)
    let chkPassword = await user.comparePassword(info.password)
    if (!chkPassword) throw new CustomError("incorect password", 400)
    let newToken = token.genToken(user)
    return {
        status: 200,
        msg: 'user logedin succesfully',
        token: newToken
    }
}
const deleteAccount = async (info) => {
    let user = await User.findById(info.id)
    if (!user) throw new CustomError('user with this Id doesnot exist', 404)
    await findOneAndUpdate(info.id, { deletedAt: Date.now() })
    return {
        status: true,
        msg: 'user account Deleted '
    }
}


export default { registerUser, loginUser, registerAndRecover, registerWithOutRecover };