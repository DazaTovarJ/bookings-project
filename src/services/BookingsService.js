import pool from "../database/connection.js";
import { APIError } from "../exceptions/APIError.js";
import { ClientError } from "../exceptions/ClientError.js";

export async function getBookings() {
  const [bookings] = await pool.query(
    "SELECT * FROM bookings WHERE active = TRUE"
  );

  return bookings;
}

export async function getBookingById(id) {
  const [bookings] = await pool.query(
    "SELECT * FROM bookings WHERE id = ? AND active = TRUE",
    [id]
  );

  return bookings[0];
}

export async function getBookingsByRoom(roomId) {
  const [bookings] = await pool.query(
    "SELECT * FROM bookings WHERE room_id = ? AND active = TRUE",
    [roomId]
  );

  return bookings;
}

export async function createBooking(booking) {
  if (!booking) {
    throw new ClientError("No booking data provided");
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();
  try {
    const [result] = await connection.query(
      "INSERT INTO bookings SET ?",
      booking
    );

    await connection.commit();

    return result.insertId;
  } catch (e) {
    await connection.rollback();

    if (error instanceof ClientError) {
      throw error;
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
    await connection.rollback();

    if (error instanceof ClientError) {
      throw error;
    }

    throw new APIError("Could not update booking", 500);
  } finally {
    connection.release();
  }
}

export async function deleteBooking(id) {
  if (!id) {
    throw new ClientError("No booking provided");
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();

  try {
    let sql = "UPDATE bookings SET active = FALSE, deleted_at = ? WHERE id = ?";
    const [result] = await connection.execute(sql, [new Date(), id]);

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
