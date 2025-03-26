import { Router } from "express";
const router = Router();
import * as controller from "../controllers/user.controller.js"
import auth from "../middleware/auth.js";




export default router;