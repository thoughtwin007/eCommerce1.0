import { Router } from "express";
import authUser from "../middlewares/errorHandlers/authUser.js";
import productController from "../controllers/productController.js"
const router = Router();


router.route('/').get(productController.getAllProducts)
router.route('/:id').get(productController.getProductById)

router.use(authUser.islogedin)
router.use(authUser.isAuthorized('seller'))

router.route('/').post(productController.createProduct)
router.route("/:id").patch(productController.updateProduct)
router.route('/:id').delete(productController.deleteProduct)

export default router;