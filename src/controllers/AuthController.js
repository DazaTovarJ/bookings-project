import {Router} from "express";
import {asyncHandler} from "../middleware/async_handler.js";
import {
  changeCredentials,
  checkCredentials,
  createUser,
  getUserByEmail,
} from "../services/UserService.js";
import {ClientError} from "../exceptions/ClientError.js";
import {UnauthorizedError} from "../exceptions/UnauthorizedError.js";
import {sign} from "../lib/JwtUtils.js";
import appConfig from "../config/app.js";
import {checkJWT} from "../middleware/check_jwt.js";
import passport from "passport";
import {APIError} from "../exceptions/APIError.js";

const router = Router();

router.post(
  "/login",
  [],
  asyncHandler(async (req, res, next) => {
    passport.authenticate("login", async (err, user, info) => {
      try {
        if ((err & err != null) || !user) {
          console.trace(err);
          const error = new APIError("Could not log in", 500);

          return next(error);
        }

        req.logIn(user, {session: false}, async (error) => {
          if (error) return next(error);

          const token = await sign(
            {uid: user.id},
            {
              issuer: appConfig.jwt.issuer,
              audience: appConfig.jwt.audience,
              subject: user.email,
            },
          );

          return res.status(200).json({user, token, token_type: "Bearer"});
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  }),
);

router.post(
  "/register",
  [],
  asyncHandler(async (req, res, next) => {
    let {first_name, last_name, email, password} = req.body;

    if (!(first_name && last_name && email && password)) {
      throw new ClientError("User data is required");
    }

    if (password.length < 6) {
      throw new ClientError("Password must be at least 6 characters long");
    }

    await createUser({
      firstName: first_name,
      lastName: last_name,
      email,
      password,
    });

    res.status(201).json({message: "User registered successfully"});
  }),
);

router.get(
  "/update-password",
  [passport.authenticate("jwt", {session: false})],
  asyncHandler(async (req, res, next) => {
    const {oldPassword, newPassword} = req.body;

    if (!(oldPassword && newPassword)) {
      throw new ClientError("Either old or new password are missing");
    }

    const user = req.user;

    if (!user || !(await checkCredentials(user.id, oldPassword))) {
      throw new UnauthorizedError("Current password does not match");
    }

    await changeCredentials(user.id, newPassword);

    return res.status(200).json({message: "User credentials updated"});
  }),
);

export default router;
