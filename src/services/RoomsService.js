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
