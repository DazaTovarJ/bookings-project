import { APIError } from "../exceptions/APIError";

/**
 * 
 * @param {*} err error
 * @param {import("express").Request} req the request
 * @param {import("express").Response} res the response
 * @param {import("express").NextFunction} next the nect function
 */
export function errorHandler(err, req, res, next) {
  console.trace(err);
  if (!err instanceof APIError) {
    res.status(500).json({
      message: "Server Error, try again later"
    });
  } else {
    const customError = err;
    let response = {
      message: customError.message
    }

    if (customError.additionalInfo) {
      response.additionalInfo = customError.additionalInfo;
    }

    res.status(customError.status).json(response);
  }
}