import { AppError } from "../errors/AppError";
import { createTask, fetchTaskByUserId, findTaskByIdAndUserId } from "../repositories/user.task.repository";
import { Task } from "../types/task";

function validateTitle(title: unknown): string {
    if (typeof title !== 'string' || !title.trim()) {
        throw new AppError(400, "Title is required")
    }

    const trimmedTitle = title.trim()

    if (trimmedTitle.length > 100) {
        throw new AppError(400, "Title Must be 100 characters or less")
    }

    return trimmedTitle
}

export async function createUserTask(userId: string, title: string): Promise<Task> {
    const validTitle = validateTitle(title)
    return createTask(userId, validTitle)
}

export async function getUserTasks(userId: string): Promise<Task[]> {
    return fetchTaskByUserId(userId)
}

export async function getUserTaskById(userId: string, taskId: string): Promise<Task> {
    const task = await findTaskByIdAndUserId(taskId, userId)
    if (!task) {
        throw new AppError(404, "Task not found")
    }
    return task 
}