import { Router } from "express";
import { asyncHandler } from "../middleware/async_handler.js";
import {
  changeCredentials,
  checkCredentials,
  createUser,
  getUserByEmail,
} from "../services/UserService.js";
import { ClientError } from "../exceptions/ClientError.js";
import { UnauthorizedError } from "../exceptions/UnauthorizedError.js";
import { sign } from "../lib/JwtUtils.js";
import appConfig from "../config/app.js";
import { checkJWT } from "../middleware/check_jwt.js";

const router = Router();

router.post(
  "/login",
  [],
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new ClientError("Username and password are required");
    }

    const user = getUserByEmail(email);

    if (!user || !(await checkCredentials(user.id, password))) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = await sign({
      issuer: appConfig.jwt.issuer,
      audience: appConfig.jwt.audience,
      subject: user.email,
    });

    return res.status(200).json({ user, token, token_type: "Bearer" });
  })
);

router.post(
  "/register",
  [checkJWT],
  asyncHandler(async (req, res, next) => {
    let { first_name, last_name, email, password } = req.body;

    if (!(first_name && last_name && email && password)) {
      throw new ClientError("User data is required");
    }

    await createUser({
      firstName: first_name,
      lastName: last_name,
      email,
      password,
    });

    res.status(201).json({ message: "User registered successfully" });
  })
);

router.get(
  "/update-password",
  [],
  asyncHandler(async (req, res, next) => {
    const { sub } = req.token;

    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword && newPassword)) {
      throw new ClientError("Either old or new password are missing");
    }

    const user = getUserByEmail(sub);

    if (!user || !(await checkCredentials(user.id, oldPassword))) {
      throw new UnauthorizedError("Current password does not match");
    }

    await changeCredentials(user.id, newPassword);

    return res.status(200).json({ message: "User credentials updated" });
  })
);

export default router;
