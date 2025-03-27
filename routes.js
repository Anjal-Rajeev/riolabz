import { Router } from "express";
const app = Router();

import user from "./routes/user.router.js"
import category from "./routes/category.router.js"


app.get("/", (req, res) => res.send("Server Running 🚀"));

app.use("/user", user)
app.use("/category", category)


export default app;