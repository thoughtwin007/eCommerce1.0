import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Product from "./productModel.js";
import Coupon from "./couponModel.js";
import Cart from "./cart.js";
import Order from "./orderModel.js";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["seller", "buyer", "admin"]
    }, deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })
userSchema.index({ email: 1, role: 1 }, { unique: true });
userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.post('findByIdAndUpdate', async function (user) {
    if (user?.role === 'seller') {
        const sellerId = user?._id;
        await Product.findByIdAndUpdate(sellerId, { deletedAt: Date.now() })
        await Coupon.deleteMany({ sellerId })
        await Cart.updateMany(
            {},
            { $pull: { items: { productId: { $in: await Product.find({ sellerId }).distinct('_id') } } } }
        );
    } else {
        const buyerId = user?._id;
        await Cart.deleteMany({ buyerId });
        await Order.findByIdAndUpdate(buyerId, { deleteAt: Date.now() })

    }
})
const User = new mongoose.model("User", userSchema)
export default User;