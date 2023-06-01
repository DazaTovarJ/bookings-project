import { APIError } from "../exceptions/APIError.js";

/**
 *
 * @param {*} err error
 * @param {import("express").Request} req the request
 * @param {import("express").Response} res the response
 * @param {import("express").NextFunction} next the next function
 */
export function errorHandler(err, req, res, next) {
  if (!(err instanceof APIError)) {
    console.trace(err);
    res.status(500).json({
      code: 500,
      data: null,
      message: "Server Error, try again later",
    });
  } else {
    const customError = err;
    let response = {
      code: customError.status,
      data: null,
      message: customError.message,
    };

    if (customError.additionalInfo) {
      response.additionalInfo = customError.additionalInfo;
    }

    res.status(customError.status).json(response);
  }
}
