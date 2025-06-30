import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0
    }
}, { timestamps: true })
const Review = new mongoose.model("Review", reviewSchema)
export default Review;

