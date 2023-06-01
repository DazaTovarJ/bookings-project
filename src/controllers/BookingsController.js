import {Router} from "express";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getBookings,
  updateBooking,
} from "../services/BookingsService.js";
import { ClientError } from "../exceptions/ClientError.js";
import { asyncHandler } from "../middleware/async_handler.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const bookings = await getBookings();

    if (!bookings || bookings.length == 0) {
      throw new NotFoundError("No bookings found");
    }

    res
      .status(200)
      .json({ code: 200, data: bookings, message: "Query successful" });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!req.params.id || Number.isNaN(req.params.id)) {
      throw new ClientError("Invalid room");
    }

    const booking = await getBookingById(req.params.id);

    if (!booking) {
      throw new NotFoundError("Room not found");
    }

    return res
      .status(200)
      .json({ code: 200, data: booking, message: "Query successful" });
  })
);

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

    await createBooking(req.user, {
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

    if (!(name || phone || booking_date || check_in || check_out || room)) {
      throw new ClientError("No data to update");
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

    await deleteBooking(req.params.id, req.user);

    return res.status(200).json({ code: 200, message: "Booking deleted" });
  })
);

export default router;
