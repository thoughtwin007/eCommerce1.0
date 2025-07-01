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
        enum: ["delivered", "cancelled", "dispatched", "confirmed", "pending", "partiallyCancelled"
        ],
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
// orderSchema.pre("save", async function (next) {
//     // Populate productId inside each item
//     await this.populate("items.productId");

//     let originalAmount = 0;

//     // Set priceAtPurchase from current product price
//     this.items = this.items.map(item => {
//         const product = item.productId;

//         if (!product || !product.price) {
//             throw new Error("Product information is missing or invalid");
//         }

//         const price = product.price;
//         const quantity = item.quantity;

//         originalAmount += price * quantity;

//         return {
//             ...item.toObject(),
//             priceAtPurchase: price
//         };
//     });

//     this.orignalAmount = originalAmount;

//     if (this.discountAmount > 0) {
//         this.totalAmount = originalAmount - this.discountAmount;
//     } else {
//         this.totalAmount = originalAmount;
//     }

//     next();
// });

const Order = new mongoose.model("Order", orderSchema)
export default Order;