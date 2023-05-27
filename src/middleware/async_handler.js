/**
 * 
 * @param {(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void} fn 
 * @returns 
 */
export function asyncHandler(fn) {

  /**
   * 
   * @param {import("express").Request} req the request
   * @param {import("express").Response} res the response
   * @param {import("express").NextFunction} next the next function
   * @returns 
   */
  const handler = (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  }

  return handler;
}