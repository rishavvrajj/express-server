import { NextFunction, Request, Response, Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createUserTask, getUserTaskById, getUserTasks, updateUserTask } from "../services/user.task.service";
import { AppError } from "../errors/AppError";

export const userTaskRouter = Router();
userTaskRouter.use(authenticate)

userTaskRouter.post("/", async (req, res, next) => {
    try {
        const task = await createUserTask(req.user!.userId, req.body.title)

        console.log(task)
        res.status(201).json({
            success: true,
            data: {
                task,
            },
        })
    } catch (error) {
        next(error)
    }
})

userTaskRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await getUserTasks(req.user!.userId)
        res.status(200).json({
            success: true,
            data: {
                tasks
            }
        })
    } catch (error) {
        next(error)
    }
})

userTaskRouter.get("/:taskId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.taskId

        if (typeof taskId !== "string" || taskId.trim() === "") {
            throw new AppError(400, "Task ID is required");
        }

        const task = await getUserTaskById(req.user!.userId, taskId)
        res.status(200).json({
            success: true,
            data: {
                task
            }
        })
    } catch (error) {
        next(error)
    }
})

userTaskRouter.patch("/:taskId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.taskId

        if (typeof taskId !== "string" || taskId.trim() === "") {
            throw new AppError(400, "Task ID is required");
        }

        const task = await updateUserTask(taskId, req.user!.userId, req.body.title)

        res.status(200).json({
            success: true,
            data: {
                task
            }
        })
    } catch (error) {
        next(error)
    }
})