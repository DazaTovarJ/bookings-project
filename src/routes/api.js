import {Router} from "express";
import passport from "passport";

import {ensureJSONResponse} from "../middleware/force_json.js";
import bookingsRouter from "../controllers/BookingsController.js";
import roomsRouter from "../controllers/RoomsController.js";
import userRouter from "../controllers/UserController.js";
import authRouter from "../controllers/AuthController.js";
import {checkPermission} from "../middleware/check_permissions.js";
import {UnauthorizedError} from "../exceptions/UnauthorizedError.js";
import {NotFoundError} from "../exceptions/NotFoundError.js";

const apiRouter = Router();

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function jwtAuth(req, res, next) {
  passport.authenticate("jwt", {session: false}, (err, user) => {
    if (err) {
      if (err instanceof NotFoundError)
        throw new UnauthorizedError("Unauthorized");
      return next(err);
    }

    if (!user) throw new UnauthorizedError("Unauthorized");

    req.user = user;

    return next();
  })(req, res, next);
}

apiRouter.use(ensureJSONResponse);
apiRouter.use(
  "/bookings",
  jwtAuth,
  checkPermission("bookings"),
  bookingsRouter,
);
apiRouter.use("/rooms", jwtAuth, checkPermission("rooms"), roomsRouter);
apiRouter.use("/users", jwtAuth, checkPermission("users"), userRouter);
apiRouter.use("/auth", authRouter);

apiRouter.all("*", (req, res) => {
  res.status(404).json({message: "Not found"});
});

export default apiRouter;
