import pool from "../database/connection.js";

export async function getBookings() {
  const [bookings] = await pool.query(
    "SELECT * FROM bookings WHERE active = TRUE",
  );

  return bookings;
}

export async function getBookingById(id) {
  const [bookings] = await pool.query(
    "SELECT * FROM bookings WHERE id = ? AND active = TRUE",
    [id],
  );

  return bookings[0];
}

export async function getBookingsByRoom(roomId) {
  const [bookings] = await pool.query(
    "SELECT * FROM bookings WHERE room_id = ? AND active = TRUE",
    [roomId],
  );

  return bookings;
}

export async function createBooking(booking) {
  const connection = await pool.getConnection();

  await connection.beginTransaction();
  try {
    const [result] = await connection.query(
      "INSERT INTO bookings SET ?",
      booking,
    );

    await connection.commit();

    return result.insertId;
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
}

export async function updateBooking(id, booking) {
  const connection = await pool.getConnection();

  await connection.beginTransaction();

  try {
    const [result] = await pool.query(
      "UPDATE bookings SET ? WHERE id = ? AND active = TRUE",
      [booking, id],
    );

    await connection.commit();

    return result.affectedRows === 1;
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
}

export async function deleteBooking(id) {
  const connection = await pool.getConnection();

  await connection.beginTransaction();

  try {
    const [result] = await pool.query(
      "UPDATE bookings SET active = FALSE, deleted_at = ? WHERE id = ?",
      [new Date(), id],
    );

    await connection.commit();

    return result.affectedRows === 1;
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
}
