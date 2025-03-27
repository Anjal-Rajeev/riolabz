import { Router } from "express";
const router = Router();
import * as controller from "../controllers/category.controller.js"
import auth from "../middleware/auth.js";


router.post("/", auth, controller.createCategory);
router.put("/", auth, controller.updateCategory);
router.get("/", controller.listCategories);


export default router;