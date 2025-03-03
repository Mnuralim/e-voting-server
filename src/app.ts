import express, { type Express } from "express";
import cors from "cors";
import morgan from "morgan";
import { ApiError, errorHandler } from "./lib/utils";
import cookieParser from "cookie-parser";
import { whitelistRouter } from "./routes/whitelist";
import { authRouter } from "./routes/auth";
import { authentication } from "./middleware/authentication";
import { authorization } from "./middleware/auhorization";
import { studentRouter } from "./routes/student";

const app: Express = express();

const apiVersion = "/api/v1";

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: `${Bun.env.NODE_ENV === "development" ? "http" : "https"}://${
      process.env.CLIENT_DOMAIN
    }`,
    credentials: true,
  })
);

app.use(`${apiVersion}/whitelist`, whitelistRouter);
app.use(`${apiVersion}/auths`, authRouter);
app.use(`${apiVersion}/students`, studentRouter);
app.get(
  `${apiVersion}/protected`,
  authentication,
  authorization,
  (req, res) => {
    res.status(200).json({
      message: "Protected route",
    });
  }
);
app.all("*", (req, res, next) => {
  next(new ApiError(`Routes does not exist`, 404));
});

app.use(errorHandler);

export { app };
