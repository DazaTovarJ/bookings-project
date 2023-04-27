import {Router} from "express";

const webRouter = Router();

webRouter.get("/", (req, res) => {
  res.send("Hello World!");
});

export default webRouter;
