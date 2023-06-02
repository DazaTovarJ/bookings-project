import fs from "fs";

import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import appConfig from "../config/app.js";
import { getUserById } from "../services/UserService.js";

const publicKey = fs.readFileSync(appConfig.jwt.publicKey);

const verificationStrategy = new Strategy(
  {
    secretOrKey: publicKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (token, done) => {
    try {
      const user = await getUserById(token.uid);

      delete user.user_password;

      return done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

passport.use(verificationStrategy);
