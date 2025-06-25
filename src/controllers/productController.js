import asyncErrorHandler from "../middlewares/errorHandlers/asyncErrorHandler.js";
import productService from "../services/productService.js";
const getAllProducts = asyncErrorHandler(async (req, res) => {
    let info = await productService.getAllProducts()
    res.status(info.status).json(info);
})
const getProductById = asyncErrorHandler(async (req, res) => {
    let info = await productService.getProductById(req.params.id);
    res.status(info.status).json(info)
})
const createProduct = asyncErrorHandler(async (req, res) => {
    let sellerId = req.userInfo.id;
    let data = req.body
    let info = await productService.createProduct(sellerId, data);
    res.status(info.status).json(info)
})
const updateProduct = asyncErrorHandler(async (req, res) => {
    let productId = req.params.id;
    let sellerId = req.userInfo.id
    let updatedData = req.body
    let info = await productService.updateProduct(productId, sellerId, updatedData);
    res.status(info.status).json(info)
})
const deleteProduct = async (req, res) => {
    let productId = req.params.id;
    let sellerId = req.userInfo.id
    const info = await productService.deleteProduct(productId, sellerId);
    res.status(info.status).json(info)
};
export default { deleteProduct, getAllProducts, updateProduct, createProduct, getProductById }