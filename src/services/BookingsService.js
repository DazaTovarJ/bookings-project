import pool from "../database/connection.js";
import { APIError } from "../exceptions/APIError.js";
import { ClientError } from "../exceptions/ClientError.js";
import {getRoomById} from "./RoomsService.js";

export async function getBookings() {
  const [bookings] = await pool.query(
    "SELECT * FROM bookings WHERE active = TRUE",
  );

  for (const booking of bookings) {
    const room = await getRoomById(booking.room_id);

    delete booking.room_id;
    booking.room = room;
  }

  return bookings;
}

export async function getBookingById(id) {
  const [bookings] = await pool.query(
    "SELECT * FROM bookings WHERE id = ? AND active = TRUE",
    [id]
  );
  const booking = bookings[0];
  const room = await getRoomById(booking.room_id);

  delete booking.room_id;
  booking.room = room;

  return booking;
}

export async function getBookingsByRoom(roomId) {
  const [bookings] = await pool.query(
    "SELECT * FROM bookings WHERE room_id = ? AND active = TRUE",
    [roomId]
  );

  return bookings;
}

export async function createBooking(user, booking) {
  if (!user) {
    throw new ClientError("Who is performing this action?");
  }

  if (!booking) {
    throw new ClientError("No booking data provided");
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();
  try {
    let sql = `INSERT INTO bookings (client_name,
                                     client_phone,
                                     booking_date,
                                     entry_date,
                                     end_date,
                                     room_id,
                                     created_by)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await connection.execute(sql, [
      ...Object.values(booking),
      user.id,
    ]);

    await connection.commit();

    return result.insertId;
  } catch (e) {
    await connection.rollback();

    if (e instanceof ClientError) {
      throw e;
    }

    throw new APIError("Could not create booking", 500);
  } finally {
    connection.release();
  }
}

export async function updateBooking(id, booking) {
  if (!id) {
    throw new ClientError("No booking provided");
  }

  if (!booking) {
    throw new ClientError("No booking data provided");
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();

  try {
    const [result] = await connection.query(
      "UPDATE bookings SET ? WHERE id = ? AND active = TRUE",
      [booking, id]
    );

    await connection.commit();

    return result.affectedRows === 1;
  } catch (e) {
    console.trace(e);
    await connection.rollback();

    if (e instanceof ClientError) {
      throw e;
    }

    throw new APIError("Could not update booking", 500);
  } finally {
    connection.release();
  }
}

export async function deleteBooking(id, user) {
  if (!id) {
    throw new ClientError("No booking provided");
  }

  if (!user) {
    throw new ClientError("Who is performing this action?");
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();

  try {
    let sql = `UPDATE bookings
               SET active = FALSE,
                   deleted_at = ?,
                   deleted_by = ?
               WHERE id = ?`;
    const [result] = await connection.execute(sql, [new Date(), user.id, id]);

    connection.unprepare(sql);

    await connection.commit();

    return result.affectedRows === 1;
  } catch (e) {
    await connection.rollback();

    if (error instanceof ClientError) {
      throw error;
    }

    throw new APIError("Could not delete booking", 500);
  } finally {
    connection.release();
  }
}
