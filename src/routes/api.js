import {Router} from "express";
import passport from "passport";

import {ensureJSONResponse} from "../middleware/force_json.js";
import bookingsRouter from "../controllers/BookingsController.js";
import roomsRouter from "../controllers/RoomsController.js";
import userRouter from "../controllers/UserController.js";
import authRouter from "../controllers/AuthController.js";

const apiRouter = Router();

apiRouter.use(ensureJSONResponse);
apiRouter.use(
  "/bookings",
  passport.authenticate("jwt", {session: false}),
  bookingsRouter,
);
apiRouter.use(
  "/rooms",
  passport.authenticate("jwt", {session: false}),
  roomsRouter
);
apiRouter.use(
  "/users",
  passport.authenticate("jwt", {session: false}),
  userRouter
);
apiRouter.use("/auth", authRouter);

apiRouter.all("*", (req, res) => {
  res.status(404).json({message: "Not found"});
});

export default apiRouter;
