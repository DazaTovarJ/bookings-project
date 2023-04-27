export function ensureJSONResponse(req, res, next) {
  res.setHeader("Accept", "application/json");
  return next();
}
