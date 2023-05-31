import bcrypt from "bcrypt";

import pool from "../database/connection.js";
import { APIError } from "../exceptions/APIError.js";
import { ClientError } from "../exceptions/ClientError.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";

function generateSafeCopy(user) {
  const _user = { ...user };

  delete _user.password;

  return _user;
}

export async function getUserById(id) {
  let sql = "SELECT u.* FROM users u WHERE u.id = ? AND u.active = TRUE";

  const [users] = await pool.query(sql, [id]);

  if (!users || users.length === 0) {
    throw new NotFoundError("User not found");
  }

  return generateSafeCopy(users[0]);
}

export async function getUserByEmail(email) {
  let sql = "SELECT u.* FROM users u WHERE u.email = ? AND u.active = TRUE";

  const [users] = await pool.query(sql, [email]);

  return users.length == 0 ? null : generateSafeCopy(users[0]);
}

export async function getAllUsers() {
  let sql = "SELECT u.* FROM users u WHERE u.active = TRUE";

  const [users] = await pool.query(sql);

  return users;
}

export async function createUser(userToCreate) {
  if (!userToCreate) {
    throw new ClientError("No user data provided");
  }

  if (!userToCreate.email) {
    throw new ClientError("Email is required");
  }

  if (!userToCreate.password) {
    throw new ClientError("Password is required");
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();
  try {
    const user = await getUserByEmail(userToCreate.email);

    if (user) {
      throw new ClientError("User already exists");
    }

    let sql = `INSERT INTO users (email, user_password, given_name, family_name)
                 VALUES (?, ?, ?, ?)`;

    const userToInsert = {
      email: userToCreate.email,
      user_password: await bcrypt.hash(userToCreate.password, 12),
      given_name: userToCreate.firstName,
      family_name: userToCreate.lastName,
    };

    const [rows] = await connection.execute(sql, Object.values(userToInsert));

    connection.unprepare(sql);

    await connection.commit();

    return rows;
  } catch (error) {
    console.trace(error);
    await connection.rollback();

    if (error instanceof ClientError) {
      throw error;
    }

    throw new APIError("Could not create user", 500);
  } finally {
    connection.release();
  }
}

export async function updateUser(id, userToUpdate) {
  if (!id) {
    throw new ClientError("No user provided");
  }

  if (!userToUpdate) {
    throw new ClientError("No user data provided");
  }

  if (!userToUpdate.email) {
    throw new ClientError("Email is required");
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();
  try {
    const userById = await getUserById(id);

    if (!userById) {
      throw new ClientError("User does not exist");
    }

    const userByEmail = await getUserByEmail(userToUpdate.email);

    if (userByEmail && userByEmail.id != id) {
      throw new ClientError("Email already taken.");
    }

    let sql = "UPDATE users SET ";

    const userToEdit = {
      email: userToUpdate.email,
      given_name: userToUpdate.firstName,
      family_name: userToUpdate.lastName,
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

export async function deleteUser(id) {
  if (!id) {
    throw new ClientError("No user provided");
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();
  try {
    const user = await getUserById(id);

    if (!user) {
      throw new ClientError("User does not exist");
    }

    let sql = "UPDATE users SET ? WHERE id = ?";

    const userToEdit = {
      deleted_at: new Date(),
      active: false,
    };

    for (let key in userToEdit) {
      if (userToEdit[key] === undefined) {
        delete userToEdit[key];
      }
    }

    const [rows] = await connection.execute(sql, [userToEdit, id]);

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

export async function checkCredentials(id, credential) {
  if (!id) {
    throw new ClientError("No user provided");
  }

  const user = await getUserById(id);

  if (!user) {
    throw new ClientError("User not found");
  }

  return await bcrypt.compare(credential, user.user_password);
}

export async function changeCredentials(id, newCredential) {
  if (!id) {
    throw new ClientError("No user provided");
  }

  if (!newCredential) {
    throw new ClientError("No password provided");
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();
  try {
    const userById = await getUserById(id);

    if (!userById) {
      throw new ClientError("User does not exist");
    }

    let sql = "UPDATE users SET user_password = ? WHERE id = ?";

    let credentialToSave = await bcrypt.hash(newCredential, 12);

    const [rows] = await connection.execute(sql, [credentialToSave, id]);

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
