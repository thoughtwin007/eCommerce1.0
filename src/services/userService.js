import CustomError from "../middlewares/errorHandlers/customErrorHandler.js"
import User from "../models/userModel.js"
import redis from "../utils/redis.js";
import token from "../utils/token.js"
const registerUser = async (info) => {
    // console.log("user service invoked:", info);
    let strInfo = JSON.stringify(info)
    await redis.set('registrationInfo', strInfo)
    const existingUser = await User.findOne({ email: info.email });
    console.log("deletedAt: ", existingUser?.deletedAt)
    if (existingUser) {
        if (existingUser.deletedAt) return {
            msg: 'this account was deleted before, want to continue with your old data',
            deletedAt: existingUser.deletedAt
        }; else throw new CustomError("User with this email already exists", 400);
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
    let data = await redis.get('registrationInfo');
    let parsedData = await JSON.parse(data)
    let user = await User.findOne({ email: parsedData.email })
    if (!user.deletedAt) throw new CustomError('account already present', 400)
    await User.findOneAndDelete({ email: parsedData.email })
    const newUser = await User.create(parsedData);
    let newToken = token.genToken(newUser)
    return {
        ...newUser.toObject(),
        msg: "User registered successfully",
        newToken
    };
}
const registerAndRecover = async (email, password) => {
    let user = await User.findOne({ email })
    if (!user) throw new CustomError("user with this email doesn't exist", 404)
    let chkPassword = await user.comparePassword(password)
    if (!chkPassword) throw new CustomError('incorrect password', 400)
    user = await User.findOneAndUpdate({ email }, { deletedAt: null })
    let newToken = token.genToken(user)
    return {
        status: true,
        ...user.toObject(),
        msg: "account recovered successfully"
        , newToken
    }
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
const deleteAccount = async (id) => {
    let user = await User.findById(id)
    if (!user) throw new CustomError('user with this Id doesnot exist', 404)
    await User.findOneAndUpdate({ _id: id }, { deletedAt: Date.now() })
    return {
        status: true,
        msg: 'user account Deleted '
    }
}

export default { registerUser, loginUser, registerAndRecover, registerWithOutRecover, deleteAccount };