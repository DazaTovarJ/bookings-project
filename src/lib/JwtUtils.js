import fs from "fs/promises";
import jwt from "jsonwebtoken";

import appConfig from "../config/app.js";

export async function sign(payload, options) {
  const privateKey = await fs.readFile(appConfig.privateKey);
  return jwt.sign(payload, privateKey, {
    issuer: options.issuer,
    subject: options.subject,
    audience: options.audience,
    expiresIn: "1h",
    algorithm: "RS256"
  });
}

export async function verify(token, options) {
  try {
    const publicKey = await fs.readFile(appConfig.publicKey);

    return jwt.verify(token, publicKey, {
      issuer: options.issuer,
      subject: options.subject,
      audience: options.audience,
      expiresIn: "1h",
      algorithms: ["RS256"]
    })
  } catch (error) {
    return false;
  }
}

export function decode(token) {
  return jwt.decode(token, { complete: true });
}