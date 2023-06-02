import {Router} from "express";

import {
  createRoom,
  deleteRoom,
  getRoomById,
  getRooms,
  updateRoom,
} from "../services/RoomsService.js";
import { asyncHandler } from "../middleware/async_handler.js";
import { ClientError } from "../exceptions/ClientError.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { getBookingsByRoom } from "../services/BookingsService.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const rooms = await getRooms();

    if (rooms.length == 0) {
      throw new NotFoundError("No rooms found");
    }

    res
      .status(200)
      .json({ code: 200, data: rooms, message: "Query successful" });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!req.params.id || Number.isNaN(req.params.id)) {
      throw new ClientError("Invalid room");
    }

    const room = await getRoomById(req.params.id);

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    return res
      .status(200)
      .json({ code: 200, data: room, message: "Query successful" });
  })
);

router.get(
  "/:id/bookings",
  asyncHandler(async (req, res) => {
    if (!req.params.id || Number.isNaN(req.params.id)) {
      throw new ClientError("Invalid room");
    }

    const rooms = await getBookingsByRoom(req.params.id);

    if (!rooms || rooms.length === 0) {
      throw new NotFoundError("No bookings were found for this room");
    }

    return res
      .status(200)
      .json({ code: 200, data: rooms, message: "Query successful" });
  })
); 

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

    res.status(201).json({ code: 201, message: "Room created" });
  })
);

router.patch(
  "/:id",
  asyncHandler(async (req, res, next) => {
    let { room_number, room_type, room_value } = req.body;

    const id = req.params["id"];

    if (!id || Number.isNaN(Number(id))) {
      throw new ClientError("Invalid room");
    }

    if (!(room_number || room_type || room_value)) {
      throw new ClientError("Missing data");
    }

    if (room_value < 0) {
      throw new ClientError("Invalid price");
    }

    await updateRoom(id, {
      number: room_number,
      type: room_type,
      value: room_value,
    });

    res.status(200).json({ code: 200, message: "Room updated" });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const id = req.params["id"];

    if (!id || Number.isNaN(Number(id))) {
      throw new ClientError("Invalid room");
    }

    await deleteRoom(id, req.user);

    res.status(200).json({ code: 200, message: "Room deleted successfully" });
  })
);

export default router;
