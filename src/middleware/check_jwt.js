import appConfig from "../config/app.js";
import { verify } from "../lib/JwtUtils.js";

/**
 * Check if a JWT token is provided in the request
 * @param {import("express").Request} req the request
 * @param {import("express").Response} res the response
 * @param {import("express").NextFunction} next the next function
 */
export function checkJWT(req, res, next) {
  const auth = req.headers.authorization;

  let payload;
  try {
    let token = auth.split(" ")[1];

    verify(token, {
      issuer: appConfig.jwt.issuer,
      audience: appConfig.jwt.audience,
      subject: user.email,
    })
      .then((payload) => {
        if (!payload) {
          return Promise.reject();
        }
        req.token = payload;
      })
      .catch((err) => {
        console.trace(err);
        res.status(401).json({ message: "Invalid credentials" });
      });
  } catch (error) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  next();
}
