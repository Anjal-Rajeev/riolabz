import { Router } from "express";
const router = Router();
import * as controller from "../controllers/user.controller.js"
import auth from "../middleware/auth.js";


router.post("/register", controller.register)
router.post("/login", controller.loginUser)

router.put("/", auth, controller.updateAccount)
router.get("/", auth, controller.listUsers)
router.get("/details", auth, controller.listUserForUpdate)
router.put("/privilege", auth, controller.changeAccountPrivilege)

router.get("/options/privilege", auth, controller.privilegeOptions)


export default router;