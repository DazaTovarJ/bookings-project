import { Router } from "express";
import { asyncHandler } from "../middleware/async_handler.js";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../services/UserService.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const users = await getAllUsers();

    return res
      .status(200)
      .json({code: 200, data: users, message: "Query successful"});
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const id = req.params["id"];

    const user = await getUserById(id);

    return res
      .status(200)
      .json({code: 200, data: user, message: "Query successful"});
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const id = req.params["id"];

    const {firstName, lastName, email} = req.body;

    await updateUser(id, {firstName, lastName, email});

    return res
      .status(200)
      .json({code: 200, message: "User successfully updated"});
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (res, req, next) => {
    const id = req.params["id"];

    await deleteUser(id);

    return res
      .status(200)
      .json({code: 200, message: "User successfully deleted"});
  }),
);

export default router;
