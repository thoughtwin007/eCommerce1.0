import CustomError from "../middlewares/errorHandlers/customErrorHandler.js";
import Product from "../models/productModel.js";
const getAllProducts = async () => {
    const products = await Product.find({ deletedAt: { $eq: null } });
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
    if (productInfo.sellerId != sellerId) throw new CustomError("product belongs to another seller", 400)
    const product = await Product.findByIdAndUpdate(productId, updatedData, {
        new: true,
    });
    if (!product) throw new CustomError('product not found', 404)
    return {
        status: 200,
        product,
        msg: "product updated"
    }
};
const deleteProduct = async (productId, sellerId) => {
    const productInfo = await Product.findById(productId)
    if (productInfo.sellerId != sellerId) throw new CustomError("product belongs to another seller", 400)
    const product = await Product.findByIdAndDelete(productId);
    if (!product) throw new CustomError('product not found', 404)
    return {
        product,
        msg: "product deleted",
        status: 200
    };
};
export default { deleteProduct, getAllProducts, updateProduct, createProduct, getProductById }