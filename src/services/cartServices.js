import CustomError from "../middlewares/errorHandlers/customErrorHandler.js";
import Cart from "../models/cart.js";
const addToCart = async (userId, productId, quantity) => {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({ productId, quantity });
    }

    await cart.save();
    return { status: 200, cart };
}

const getCart = async (userId) => {
    let data = await Cart.findOne({ userId }).populate('items.productId');
    if (!data) throw new CustomError("cart is empty", 404)

    return {
        data,
        status: 200
    }
}

const updateItemQuantity = async (userId, productId, quantity) => {
    const cart = await Cart.findOne({ userId });

    if (!cart) throw new CustomError("Cart not found", 404);
    console.log("productId :", productId)
    const item = cart.items.find(item => item.productId.equals(productId));
    if (!item) throw new CustomError("Item not in cart", 404);

    item.quantity = quantity;
    await cart.save();
    return {
        cart,
        status: 200,
        msg: "item quantity updated"
    }
}

const removeItem = async (userId, productId) => {
    const cart = await Cart.findOne({ userId });

    if (!cart) throw new CustomError("Cart not found", 404);
    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    await cart.save();
    return { cart, status: 200, msg: 'item removed from cart' }
}


export default { removeItem, updateItemQuantity, getCart, addToCart };
