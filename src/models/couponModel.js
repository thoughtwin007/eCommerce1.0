import mongoose, { mongo } from "mongoose";
import User from "./userModel.js";
import CustomError from "../middlewares/errorHandlers/customErrorHandler.js";
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: String,
        required: true
    },
    validFrom: {
        type: Date,
        required: true
    },
    validTill: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        default: 1
    },
    usedCount: {
        type: Number,
        default: 0
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })
couponSchema.pre("save", function (next) {
    if (typeof this.validFrom === "string") {
        this.validFrom = new Date(this.validFrom);
    }
    if (typeof this.validTill === "string") {
        this.validTill = new Date(this.validTill);
    }
    if (this.validFrom < this.validTill) throw new CustomError('validFrom date should be less then valid till')
    next();
});

const Coupon = new mongoose.model("Coupon", couponSchema)
export default Coupon;