import mongoose from "mongoose";
const itemsSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true
    },
    priceAtPurchase: {
        type: Number,
        required: true
    }
})
const orderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [itemsSchema]
    , couponCode: {
        type: String,
        default: null
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    orignalAmount: {
        type: Number,
        requied: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["delivered", "cancelled", "dispatched", "confirmed", "pending"],
        default: "pending"
    },
    cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    cancelReason: {
        type: String,
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

const Order = new mongoose.model("Order", orderSchema)
export default Order;