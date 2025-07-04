import express from "express"
import "dotenv/config"
import mongoose from "mongoose";
import authrouter from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js"
import cartRoutes from "./src/routes/cartRoutes.js"
import couponRoutes from "./src/routes/couponRoutes.js"
import checkoutRoutes from "./src/routes/checkoutRoute.js"
import orderRoutes from "./src/routes/orderRoutes.js"
const app = express();
app.use(express.json())
const port = process.env.PORT || 3000;

console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('DB CONNECTION SUCCESS')
})
app.use("/api/v1/auth", authrouter);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/checkout', checkoutRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 400
    const status = err.status || "Something went wrong";
    const msg = err.message || "Something went wrong";
    console.log("msg:", msg)
    res.status(statusCode).json({ status, msg, stack: err.stack });
});



const server = app.listen(process.env.PORT, () => {
    console.log("server is listening on port:", port)
})

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use.`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
        process.exit(1);
    }
});