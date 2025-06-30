import CustomError from "../middlewares/errorHandlers/customErrorHandler.js"
import Product from "../models/productModel.js";
import User from "../models/userModel.js"
import token from "../utils/token.js"
const registerUser = async (info) => {
    console.log("user service invoked:", info);
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
const registerAndRecover = async (info) => {
    if (info.recover) {
        let data = await User.findAndUpdate({ email: info.email }, { deletedAt: null })
        let productData = await Product.updateMany({ userId: data._id }, { $set: { deletedAt: null } })

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

export default { registerUser, loginUser };