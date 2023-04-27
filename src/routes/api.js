import {Router} from "express";
import {ensureJSONResponse} from "../middleware/force_json.js";

const apiRouter = Router();

apiRouter.use(ensureJSONResponse);

apiRouter.get("/", (req, res) => {
  res.send({message: "Hello World!"});
});

export default apiRouter;
