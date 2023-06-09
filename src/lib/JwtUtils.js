import fs from "fs/promises";
import jwt from "jsonwebtoken";

import appConfig from "../config/app.js";

export async function sign(payload, options) {
  const privateKey = await fs.readFile(appConfig.jwt.privateKey);
  return jwt.sign(payload, privateKey, {
    issuer: options.issuer,
    subject: options.subject,
    audience: options.audience,
    expiresIn: "1h",
    algorithm: "ES512",
  });
}

export async function verify(token, options) {
  try {
    const publicKey = await fs.readFile(appConfig.jwt.publicKey);

    return jwt.verify(token, publicKey, {
      issuer: options.issuer,
      subject: options.subject,
      audience: options.audience,
      expiresIn: "1h",
      algorithms: ["ES512"],
    });
  } catch (error) {
    return false;
  }
}

export function decode(token) {
  return jwt.decode(token, { complete: true });
}