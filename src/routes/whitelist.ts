import { Router } from "express";
import {
  bulkAccessToken,
  generateAccessToken,
  whitelistAddress,
} from "../controller/whitelist";
import { authentication } from "../middleware/authentication";
import { disableVoting } from "../middleware/disable-voting";

const whitelistRouter: Router = Router();

whitelistRouter.post("/", disableVoting, whitelistAddress);
whitelistRouter.patch("/bulk", authentication, disableVoting, bulkAccessToken);
whitelistRouter.patch(
  "/bulk/:id",
  authentication,
  disableVoting,
  generateAccessToken
);

export { whitelistRouter };
