import { pool } from "../libs/db";
import { Task } from "../types/task";

type TaskRow = Task

export async function createTask(userId: string, title: string): Promise<Task> {
    const result = await pool.query<TaskRow>(
        `
        INSERT INTO support_task (title, user_id)
        VALUES ($1, $2)
        RETURNING id, title, status, user_id, created_at, updated_at
        `,
        [title, userId]
    )
    const task = result.rows[0]
    if (!task) {
        throw new Error("Failed to create task")
    }
    return task
}

export async function fetchTaskByUserId(userId: string): Promise<Task[]> {
    const result = await pool.query<TaskRow>(
        `
        SELECT id, title, status, user_id, created_at, updated_at
        FROM support_task 
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
    )

    return result.rows
}