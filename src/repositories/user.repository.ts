import { pool } from "../libs/db";
import { dbUserRow, dbUserWithPasswordRow, User } from "../types/user";

export async function findUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query<dbUserRow>(
        `SELECT id, email, role, created_at FROM users WHERE email = $1`,
        [email]
    )

    return result.rows[0] ?? null;
}

export async function createUser(email: string, passwordHash: string): Promise<User | null> {
    const result = await pool.query<dbUserRow>(
        `INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email, role, created_at`,
        [email, passwordHash]
    )

    return result.rows[0] ?? null;
}

export async function findUserByEmailWithPassword(email: string): Promise<dbUserWithPasswordRow | null> {
    const result = await pool.query<dbUserWithPasswordRow>(
        `SELECT id, email, role, password_hash, created_at FROM users WHERE email = $1`,
        [email]
    )
    return result.rows[0] ?? null;
}