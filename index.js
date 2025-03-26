import express from "express"
import chalk from "chalk"
import cors from "cors";
import logger from "morgan"
import cookieParser from "cookie-parser";
import { error } from "express-error-catcher";
import "dotenv/config";
import "./helpers/global.js";
import { PORT } from "./config.js";

import connectDB from "./database/index.js";

import indexRouter from "./routes.js";
import models from "./models/index.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({ origin: true, credentials: true }));

app.use(error({log:"dev"}));

app.use("/", indexRouter)

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(chalk.blueBright(`server listening on port ${PORT}`));
    });
  })
  .catch((error) => {
    console.log(chalk.red(`server not started`));
  });

export default app;