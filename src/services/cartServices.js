import CustomError from "../middlewares/errorHandlers/customErrorHandler.js";
import Cart from "../models/cart.js";
import redis from "../utils/redis.js";
const addToCart = async (buyerId, productId, quantity) => {
    let cart = await Cart.findOne({ buyerId });

    if (!cart) {
        cart = new Cart({ buyerId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({ productId, quantity });
    }

    cart.save().then(async (data) => {
        await redis.set('cart', JSON.stringify(data))
    });
    return { status: 200, cart };
}

const getCart = async (buyerId) => {
    let data = JSON.parse(await redis.get('cart'))
    if (!data) {
        console.log('no redis')
        data = await Cart.findOne({ buyerId }).populate('items.productId');
        if (!data || !data.items.length) throw new CustomError("cart is empty", 404)
        await redis.set('cart', JSON.stringify(data))
    }
    return {
        status: true,
        data,
    }
}

const updateItemQuantity = async (buyerId, productId, quantity) => {
    const cart = await Cart.findOne({ buyerId });
    if (!cart) throw new CustomError("Cart not found", 404);
    console.log("productId :", productId)
    const item = cart.items.find(item => item.productId.equals(productId));
    if (!item) throw new CustomError("Item not in cart", 404);

    item.quantity = quantity;
    cart.save().then(async (data) => {
        await redis.set('cart', JSON.stringify(data))
    });
    return {
        cart,
        status: 200,
        msg: "item quantity updated"
    }
}

const removeItem = async (buyerId, productId) => {
    const cart = await Cart.findOne({ buyerId });
    if (!cart) throw new CustomError("Cart not found", 404);
    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    cart.save().then(async (data) => {
        await redis.set('cart', JSON.stringify(data))
    });
    return { cart, status: 200, msg: 'item removed from cart' }
}


export default { removeItem, updateItemQuantity, getCart, addToCart };
