import {Router} from "express";
import {getRoomById, getRooms} from "../services/RoomsService.js";

const router = Router();

router.get("/", async (req, res) => {
  const rooms = await getRooms();

  if (rooms.length == 0) {
    return res.status(404).json({message: "No rooms found"});
  }

  res.json(rooms);
});

router.get("/:id", async (req, res) => {
  const room = await getRoomById(req.params.id);

  if (!room) {
    return res.status(404).json({message: "Room not found"});
  }

  res.json(room);
});

export default router;
