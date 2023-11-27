import fs from "fs";

import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import appConfig from "../config/app.js";
import { getUserById } from "../services/UserService.js";
import {NotFoundError} from "../exceptions/NotFoundError.js";

const publicKey = fs.readFileSync(appConfig.jwt.publicKey);

const verificationStrategy = new Strategy(
  {
    secretOrKey: publicKey,
    issuer: appConfig.jwt.issuer,
    audience: appConfig.jwt.audience,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (token, done) => {
    try {
      const user = await getUserById(token.uid);

      delete user.user_password;

      return done(null, user);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return done(null, false);
      }
      done(error);
    }
  },
);

passport.use(verificationStrategy);
