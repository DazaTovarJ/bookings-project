import {Router} from "express";
import {
  createBooking,
  deleteBooking,
  updateBooking,
} from "../services/BookingsService.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/", async (req, res) => {
  const {name, phone, booking_date, check_in, check_out, room} = req.body;

  if (!name || !phone || !booking_date || !check_in || !check_out || !room) {
    return res.status(400).json({message: "Missing required fields"});
  }

  if (new Date(booking_date).toString() === "Invalid Date") {
    return res.status(400).json({message: "Invalid booking date"});
  }

  if (new Date(check_in).toString() === "Invalid Date") {
    return res.status(400).json({message: "Invalid check in date"});
  }

  if (new Date(check_out).toString() === "Invalid Date") {
    return res.status(400).json({message: "Invalid check out date"});
  }

  if (new Date(booking_date) >= new Date()) {
    return res
      .status(400)
      .json({message: "Booking date must be in the future"});
  }

  if (new Date(check_in) > new Date(check_out)) {
    return res
      .status(400)
      .json({message: "Check in date must be before check out date"});
  }

  try {
    await createBooking({
      client_name: name,
      client_phone: phone,
      booking_date,
      entry_date: check_in,
      end_date: check_out,
      room_id: room,
    });

    return res.status(201).json({message: "Booking created"});
  } catch (e) {
    return res.status(500).json({message: e.message});
  }
});

router.patch("/:id", async (req, res) => {
  if (!req.params.id || Number.isNaN(Number(req.params.id))) {
    return res.status(400).json({message: "Invalid booking id"});
  }

  const {name, phone, booking_date, check_in, check_out, room} = req.body;

  if (
    booking_date != undefined &&
    new Date(booking_date).toString() === "Invalid Date"
  ) {
    return res.status(400).json({message: "Invalid booking date"});
  }

  if (
    check_in != undefined &&
    new Date(check_in).toString() === "Invalid Date"
  ) {
    return res.status(400).json({message: "Invalid check in date"});
  }

  if (
    check_out != undefined &&
    new Date(check_out).toString() === "Invalid Date"
  ) {
    return res.status(400).json({message: "Invalid check out date"});
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
    return res.status(400).json({message: "No fields to update"});
  }

  try {
    let updated = await updateBooking(req.params.id, bookingToUpdate);

    if (!updated) {
      return res.status(404).json({message: "Booking not found"});
    }
    return res.json({message: "Booking updated successfully"});
  } catch (e) {
    console.trace(e);
    return res.status(500).json({message: e.message});
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.params.id || Number.isNaN(Number(req.params.id))) {
    return res.status(400).json({message: "Invalid booking id"});
  }

  try {
    let deleted = await deleteBooking(req.params.id);

    if (!deleted) {
      return res.status(404).json({message: "Booking not found"});
    }

    return res.json({message: "Booking deleted"});
  } catch (e) {
    return res.status(500).json({message: e.message});
  }
});

export default router;
