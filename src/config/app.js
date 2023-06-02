import dotenv from "dotenv";

dotenv.config();

const appConfig = {
  port: process.env.PORT || 3000,
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY_FILE,
    publicKey: process.env.JWT_PUBLIC_KEY_FILE,
    issuer: process.env.JWT_AUDIENCE,
    audience: process.env.JWT_AUDIENCE,
  },
};

export default appConfig;
