import CustomError from "../middlewares/errorHandlers/customErrorHandler.js";
import Product from "../models/productModel.js";
import redis from "../utils/redis.js";
const getAllProducts = async () => {
    let products = [];
    if (!await redis.get('allProducts')) {
        products = await Product.find({ deletedAt: { $eq: null } })
        await redis.set('allProducts', JSON.stringify(products))
    }
    else { products = JSON.parse(await redis.get("allProducts")) }
    return {
        products,
        status: 200
    }
};
const getProductById = async (data) => {
    const product = await Product.findById(data);
    if (!product || product.deletedAt) throw new CustomError("product not found", 404);
    return {
        product,
        status: 200
    }
};
const createProduct = async (sellerId, data) => {
    const product = await Product.create({ sellerId, ...data });
    return {
        product,
        status: 200,
        msg: "product created"
    }
};


const updateProduct = async (productId, sellerId, updatedData) => {
    const productInfo = await Product.findById(productId)
    if (!productInfo) throw new CustomError('product not found for this Id', 404)
    if (productInfo.sellerId != sellerId) throw new CustomError("product belongs to another seller", 400)
    const product = await Product.findByIdAndUpdate(productId, updatedData, {
        new: true,
    }).select('_id');
    if (!product) throw new CustomError('product not found', 404)
    await redis.del('allProducts')
    return {
        status: 200,
        productId: product._id,
        msg: "product updated"
    }
};
const deleteProduct = async (productId, sellerId) => {
    const productInfo = await Product.findById(productId)
    if (productInfo.sellerId != sellerId) throw new CustomError("product belongs to another seller", 400)
    const product = await Product.findByIdAndDelete(productId).select(_id);
    if (!product) throw new CustomError('product not found', 404)
    return {
        productId: product.id,
        msg: "product deleted",
        status: 200
    };
};
export default { deleteProduct, getAllProducts, updateProduct, createProduct, getProductById }