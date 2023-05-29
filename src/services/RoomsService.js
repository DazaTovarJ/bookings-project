import pool from "../database/connection.js";

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

