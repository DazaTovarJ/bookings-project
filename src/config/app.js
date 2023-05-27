import dotenv from "dotenv";

dotenv.config();

const appConfig = {
  port: process.env.PORT || 3000,
  privateKey: process.env.JWT_PRIVATE_KEY_FILE,
  publicKey: process.env.JWT_PUBLIC_KEY_FILE
};

export default appConfig;
