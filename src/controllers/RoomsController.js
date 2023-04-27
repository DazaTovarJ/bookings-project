import {Router} from "express";
import {getRoomById, getRooms} from "../services/RoomsService.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rooms = await getRooms();

    if (rooms.length == 0) {
      return res.status(404).json({message: "No rooms found"});
    }

    res.json(rooms);
  } catch (e) {
    return res.status(500).json({message: e.message});
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await getRoomById(req.params.id);

    if (!room) {
      return res.status(404).json({message: "Room not found"});
    }

    return res.json(room);
  } catch (e) {
    return res.status(500).json({message: e.message});
  }
});

export default router;
