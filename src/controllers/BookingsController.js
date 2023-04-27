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

  try {
    await createBooking({
      client_name: name,
      client_phone: phone,
      booking_date,
      entry_date: check_in,
      end_date: check_out,
      room_id: room,
    });

    return res.json({message: "Booking created"});
  } catch (e) {
    return res.status(500).json({message: e.message});
  }
});

router.patch("/:id", async (req, res) => {
  const {name, phone, booking_date, check_in, check_out, room} = req.body;

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

  try {
    let updated = await updateBooking(req.params.id, bookingToUpdate);

    if (!updated) {
      return res.status(404).json({message: "Booking not found"});
    }
    return res.json({message: "Booking updated successfully"});
  } catch (e) {
    return res.status(500).json({message: e.message});
  }
});

router.delete("/:id", async (req, res) => {
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
