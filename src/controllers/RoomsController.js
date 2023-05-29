import {Router} from "express";

import { createRoom, getRoomById, getRooms } from "../services/RoomsService.js";
import { asyncHandler } from "../middleware/async_handler.js";
import { ClientError } from "../exceptions/ClientError.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rooms = await getRooms();

    if (rooms.length == 0) {
      return res.status(404).json({ message: "No rooms found" });
    }

    res.json(rooms);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  if (!req.params.id || Number.isNaN(req.params.id)) {
    return res.status(400).json({ message: "Invalid booking id" });
  }

  try {
    const room = await getRoomById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.json(room);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.post(
  "/",
  asyncHandler(async (req, res) => {
    let { room_number, room_type, room_value } = req.body;

    if (!(room_number && room_type && room_value)) {
      throw new ClientError("Missing required data");
    }

    if (room_value < 0) {
      throw new ClientError("Invalid price");
    }

    await createRoom(req.user, {
      number: room_number,
      type: room_type,
      value: room_value,
    });

    res.status(201).json({ message: "Room created" });
  })
);

export default router;
