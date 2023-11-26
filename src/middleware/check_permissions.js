import {checkPermissions} from "../services/UserService.js";

/**
 *
 * @param {string} resource
 * @returns {import("express").RequestHandler}
 */
export function checkPermission(resource) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({message: "Unauthorized"});
    }

    if (!req.user.id) {
      return res.status(401).json({message: "Unauthorized"});
    }

    if (!resource) {
      return res.status(401).json({message: "Unauthorized"});
    }

    try {
      let resourceData = await checkPermissions(req.user, resource);

      if (!resourceData) {
        return res.status(401).json({message: "Unauthorized"});
      }

      if (!resourceData[0].access_level) {
        console.log(req.method);
        if (req.method !== "GET") {
          return res.status(401).json({message: "Unauthorized"});
        }
      }
    } catch (error) {
      return res.status(401).json({message: "Unauthorized"});
    }

    return next();
  };
}
