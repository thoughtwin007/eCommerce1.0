import asyncErrorHandler from '../middlewares/errorHandlers/asyncErrorHandler.js';
import cartService from "../services/cartServices.js"
const addToCart = asyncErrorHandler(async (req, res) => {
    const buyerId = req.userInfo.id;
    const { productId, quantity } = req.body;
    const info = await cartService.addToCart(buyerId, productId, quantity);
    res.status(info.status).json(info);
})

const getCart = asyncErrorHandler(async (req, res) => {
    const userId = req.userInfo.id
    const info = await cartService.getCart(userId);
    res.status(info.status).json(info || { items: [] });
})

const updateCartItem = asyncErrorHandler(async (req, res) => {
    const userId = req.userInfo.id;
    const { productId } = req.params;
    console.log("productId from req", productId)
    const { quantity } = req.body;
    const info = await cartService.updateItemQuantity(userId, productId, quantity);
    res.status(info.status).json(info);
})

const removeItem = asyncErrorHandler(async (req, res) => {
    const userId = req.userInfo.id;
    const { productId } = req.params;
    const info = await cartService.removeItem(userId, productId);
    res.status(info.status).json(info);
})

export default { removeItem, updateCartItem, getCart, addToCart }
