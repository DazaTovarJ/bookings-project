import passport from "passport";
import { Strategy } from "passport-local";

import { checkCredentials, getUserByEmail } from "../services/UserService.js";

const loginStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = await getUserByEmail(email);

      if (!user) {
        return done(null, false, { message: "invalid credentials" });
      }

      const validPassword = await checkCredentials(user.id, password);

      if (!validPassword) {
        return done(null, false, { message: "Invalid credentials" });
      }

      delete user.user_password;

      return done(null, user, { message: "Logged in successfully" });
    } catch (error) {
      return done(error);
    }
  }
);

passport.use("login", loginStrategy);
