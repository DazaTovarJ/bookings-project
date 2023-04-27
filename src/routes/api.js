import {Router} from "express";
import {ensureJSONResponse} from "../middleware/force_json.js";
import roomsRouter from "../controllers/RoomsController.js";

const apiRouter = Router();

apiRouter.use(ensureJSONResponse);

apiRouter.use("/rooms", roomsRouter);

apiRouter.all("*", (req, res) => {
  res.status(404).json({message: "Not found"});
});

export default apiRouter;
