import { Router } from "express";
import authUser from "../middlewares/errorHandlers/authUser.js";
import productController from "../controllers/productController.js"
const router = Router();
router.route('/').get(productController.getAllProducts)
router.route('/:id').get(productController.getProductById)
router.route('/').post(authUser.islogedin, authUser.isAuthorized, productController.createProduct)
router.route("/:id").patch(authUser.islogedin, authUser.isAuthorized, productController.updateProduct)
router.route('/:id').delete(authUser.islogedin, authUser.isAuthorized, productController.deleteProduct)

export default router;