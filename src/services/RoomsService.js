import pool from "../database/connection.js";
import { APIError } from "../exceptions/APIError.js";
import { ClientError } from "../exceptions/ClientError.js";
import {getBookingsByRoom} from "./BookingsService.js";

export async function getRooms() {
  const [rooms] = await pool.query("SELECT * FROM rooms WHERE active = TRUE");

  return rooms;
}

export async function getRoomById(id) {
  const [rooms] = await pool.query(
    "SELECT * FROM rooms WHERE id = ? AND active = TRUE",
    [id],
  );

  return rooms[0];
}

export async function createRoom(user, room) {
  const connection = await pool.getConnection();

  await connection.beginTransaction();
  try {
    let sql = `INSERT INTO rooms (room_number, room_type, room_value, created_by)
                 VALUES (?, ?, ?, ?)`;

    const [result] = await connection.execute(sql, [
      room.number,
      room.type,
      room.value,
      user.id,
    ]);

    connection.unprepare(sql);

    await connection.commit();

    return result.insertId;
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
}

export async function updateRoom(id, roomToUpdate) {
  if (!id) {
    throw new ClientError("No room provided");
  }

  if (!roomToUpdate) {
    throw new ClientError("No room data provided");
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();
  try {
    const room = await getRoomById(id);

    if (!room) {
      throw new ClientError("Room does not exist");
    }

    let sql = "UPDATE rooms SET ";

    const userToEdit = {
      room_number: roomToUpdate.number,
      room_type: roomToUpdate.type,
      room_value: roomToUpdate.value,
    };

    for (let key in userToEdit) {
      if (userToEdit[key] === undefined) {
        delete userToEdit[key];
      }
    }

    sql += Object.entries(userToEdit)
      .map(([key, value]) => `${key} = ?`)
      .join(",");
    sql += " WHERE id = ?";

    const [rows] = await connection.execute(sql, [
      ...Object.values(userToEdit),
      id,
    ]);

    connection.unprepare(sql);

    await connection.commit();

    return rows;
  } catch (error) {
    await connection.rollback();

    if (error instanceof ClientError) {
      throw error;
    }

    throw new APIError("Could not create user", 500);
  } finally {
    connection.release();
  }
}

export async function deleteRoom(id, user) {
  if (!id) {
    throw new ClientError("No user provided");
  }

  if (!user) {
    throw new ClientError("Who is doing this action?");
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();
  try {
    const room = await getRoomById(id);

    if (!room) {
      throw new ClientError("Room does not exist");
    }

    const pendingBookings = await getBookingsByRoom(id);

    if (pendingBookings.length > 0) {
      throw new APIError("There are pending bookings for this room", 412);
    }

    let sql = `UPDATE rooms SET
               deleted_at = ?,
               deleted_by = ?,
               active = FALSE
               WHERE id = ?`;

    const [rows] = await connection.execute(sql, [new Date(), user.id, id]);

    connection.unprepare(sql);

    await connection.commit();

    return rows;
  } catch (error) {
    await connection.rollback();

    if (error instanceof ClientError) {
      throw error;
    }

    throw new APIError(
      error.message || "Could not delete room",
      error.status || 500,
    );
  } finally {
    connection.release();
  }
}
