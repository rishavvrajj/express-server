import { NextFunction, Request, Response, Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createUserTask, getUserTasks } from "../services/user.task.service";

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