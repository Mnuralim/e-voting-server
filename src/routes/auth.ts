import { Router } from "express";
import { getLoginPayload, isLoggedIn, login, logout } from "../controller/auth";

const authRouter: Router = Router();

authRouter.get("/login", getLoginPayload);
authRouter.post("/login", login);
authRouter.get("/isLoggedIn", isLoggedIn);
authRouter.post("/logout", logout);

export { authRouter };
