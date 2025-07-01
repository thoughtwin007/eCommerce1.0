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
userSchema.post('findOneAndUpdate', async function (user) {
    if (user.deletedAt) {
        if (user?.role === 'seller') {
            const sellerId = user?._id;
            await Product.updateMany({ sellerId }, { deletedAt: Date.now() })
            await Coupon.updateMany({ sellerId }, { deletedAt: Date.now() })
            await Cart.updateMany(
                {},
                { $pull: { items: { productId: { $in: await Product.find({ sellerId }).distinct('_id') } } } }
            );
        } else {
            const buyerId = user?._id;
            await Cart.deleteMany({ buyerId });
            await Order.updateMany({ buyerId }, { deleteAt: Date.now() })

        }
    } else {
        if (user?.role === 'seller') {
            await Product.updateMany({ sellerId }, { deletedAt: null })
            await Coupon.updateMany({ sellerId }, { deletedAt: null })
        }
    }
})
userSchema.post('findOneAndDelete', async function (user) {
    if (user?.role === "seller") {
        await Product.deleteMany({ sellerId })
        await Coupon.deleteMany({ sellerId })
    }
})
const User = new mongoose.model("User", userSchema)
export default User;