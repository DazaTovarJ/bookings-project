import {Router} from "express";
import {
  createBooking,
  deleteBooking,
  updateBooking,
} from "../services/BookingsService.js";
import { ClientError } from "../exceptions/ClientError.js";
import { asyncHandler } from "../middleware/async_handler.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, phone, booking_date, check_in, check_out, room } = req.body;

    if (!(name && phone && booking_date && check_in && check_out && room)) {
      throw new ClientError("Missing required fields");
    }

    if (new Date(booking_date).toString() === "Invalid Date") {
      throw new ClientError("Invalid booking date");
    }

    if (new Date(check_in).toString() === "Invalid Date") {
      throw new ClientError("Invalid check in date");
    }

    if (new Date(check_out).toString() === "Invalid Date") {
      throw new ClientError("Invalid check out date");
    }

    if (new Date(booking_date) >= new Date()) {
      throw new ClientError("Booking date must be in the future");
    }

    if (new Date(check_in) > new Date(check_out)) {
      throw new ClientError("Check in date must be before check out date");
    }

    await createBooking({
      client_name: name,
      client_phone: phone,
      booking_date,
      entry_date: check_in,
      end_date: check_out,
      room_id: room,
    });

    return res.status(201).json({ code: 201, message: "Booking created" });
  })
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!req.params.id || Number.isNaN(Number(req.params.id))) {
      throw new ClientError("Invalid booking");
    }

    const { name, phone, booking_date, check_in, check_out, room } = req.body;

    if (
      booking_date != undefined &&
      new Date(booking_date).toString() === "Invalid Date"
    ) {
      throw new ClientError("Invalid booking date");
    }

    if (
      check_in != undefined &&
      new Date(check_in).toString() === "Invalid Date"
    ) {
      throw new ClientError("Invalid check in date");
    }

    if (
      check_out != undefined &&
      new Date(check_out).toString() === "Invalid Date"
    ) {
      throw new ClientError("Invalid check out date");
    }

    const bookingToUpdate = {
      client_name: name,
      client_phone: phone,
      booking_date,
      entry_date: check_in,
      end_date: check_out,
      room_id: room,
    };

    for (let key in bookingToUpdate) {
      if (bookingToUpdate[key] === undefined) {
        delete bookingToUpdate[key];
      }
    }

    if (Object.keys(bookingToUpdate).length === 0) {
      throw new ClientError("No fields to update");
    }

    await updateBooking(req.params.id, bookingToUpdate);

    return res
      .status(200)
      .json({ code: 200, message: "Booking updated successfully" });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!req.params.id || Number.isNaN(Number(req.params.id))) {
      throw new ClientError("Invalid booking");
    }

    await deleteBooking(req.params.id);

    return res.status(200).json({ code: 200, message: "Booking deleted" });
  })
);

export default router;
