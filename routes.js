import { Router } from "express";
const app = Router();

import user from "./routes/user.router.js"


app.get("/", (req, res) => res.send("User Running 🚀"));

app.use("/user", user)


export default app;