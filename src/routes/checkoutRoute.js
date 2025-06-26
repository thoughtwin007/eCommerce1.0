import { Router } from "express";
import checkout from "../controllers/checkoutController.js";
import authUser from "../middlewares/errorHandlers/authUser.js";
const router = Router();
router.route('/:id').post(authUser.islogedin, checkout)

export default router;
