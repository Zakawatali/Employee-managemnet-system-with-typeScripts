"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = void 0;
const taskServices_1 = require("../Services/taskServices");
const createTask = async (req, res, next) => {
    try {
        const { title, description, priority, dueDate, assignTo } = req.body;
        const userId = req.user?._id?.toString();
        if (!userId) {
            // res.error("Unauthorized", {}, 401);
            res.error = "Unauthorized";
            next(401);
            return;
        }
        if (!title || !description || !assignTo) {
            // res.error("Title, description, and assignTo are required", {}, 400);
            res.error = "Title, description, and assignTo are required";
            next(400);
            return;
        }
        const newTask = await (0, taskServices_1.CreatetaskService)({
            userid: userId,
            title,
            description,
            priority,
            dueDate,
            assignTo,
        });
        // res.success("Task created successfully", { newTask }, 201);
        res.result = newTask;
        next(201);
    }
    catch (err) {
        // const message = error instanceof Error ? error.message : "Server error";
        const message = err instanceof Error ? err.message : "Server error";
        // res.error("Server error", { error: message }, 500);
        res.error = message;
        next(500);
    }
};
exports.createTask = createTask;
const getAllTasks = async (_req, res, next) => {
    try {
        const tasks = await (0, taskServices_1.getAllTaskService)();
        // res.success("Tasks fetched successfully", { tasks, count: tasks.length }, 200);
        res.result = tasks;
        next(200);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Error fetching tasks";
        // res.error("Error fetching tasks", { error: message }, 500);
        res.error = message;
        next(500);
    }
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const task = await (0, taskServices_1.getTaskByIdService)(id);
        if (!task || task.length === 0) {
            // res.error("Task not found", {}, 404);
            res.error = "Task not found";
            next(404);
            return;
        }
        // res.success("Task fetched successfully", { task }, 200);
        res.result = task;
        next(200);
    }
    catch (err) {
        // const message = error instanceof Error ? error.message : "Error fetching task";
        const message = err instanceof Error ? err.message : "Error fetching task";
        // res.error("Error fetching task", { error: message }, 500);
        res.error = message;
        next(500);
    }
};
exports.getTaskById = getTaskById;
// export const updateTask = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const task = await Task.findById(id);
//     if (!task) {
//       // res.error("Task not found", {}, 404);
//       res.error = "Task not found";
//       next(404);
//       return;
//     }
//     if (req.user?.role === "Employee") {
//       if (task.assignTo.toString() !== req.user._id.toString()) {
//         // res.error("Not authorized to update this task", {}, 403);
//         res.error = "Not authorized to update this task";
//         next(403);
//         return;
//       }
//       task.status = req.body.status || task.status;
//     } else {
//       Object.assign(task, req.body);
//     }
//     const updatedTask = await task.save();
//     // res.success("Task updated successfully", { task: updatedTask }, 200);
//     res.result = updatedTask;
//     next(200);
//   } catch (err) {
//     // const message = error instanceof Error ? error.message : "Error updating task";
//     const message = err instanceof Error ? err.message : "Error updating task";
//     // res.error("Error updating task", { error: message }, 500);
//     res.error = message;
//     next(500);
//   }
// };
//
//  import { AuthenticatedRequest } from '../middlewares/authmiddlewares.ts'; 
/**
 * Controller to handle the request for updating a task.
 * Delegates business logic and database interaction to the service layer.
 */
const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatePayload = req.body;
        const user = req.user;
        if (!user) {
            // Handle case where auth middleware somehow failed to attach user
            res.error = "Authentication required";
            next(401);
            return;
        }
        // Delegate the update logic and checks to the service layer
        const updatedTask = await (0, taskServices_1.updateTaskService)(id, updatePayload, user);
        res.result = updatedTask;
        next(200); // Success response
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Error updating task";
        // Safely determine the status code for known application errors
        const statusCode = err instanceof Error && 'statusCode' in err && typeof err.statusCode === 'number'
            ? err.statusCode
            : 500;
        res.error = message;
        next(statusCode); // Propagate the specific status code
    }
};
exports.updateTask = updateTask;
// export const deleteTask = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const deletedTask = await Task.findByIdAndDelete(id);
//     if (!deletedTask) {
//       // res.error("Task not found", {}, 404);
//       res.error = "Task not found";
//       next(404);
//       return;
//     }
//     // res.success("Task deleted successfully", { task: deletedTask }, 200);
//     res.result = deletedTask;
//     next(200);
//         } catch (err) {
//     // const message = error instanceof Error ? error.message : "Error deleting task";
//     const message = err instanceof Error ? err.message : "Error deleting task";
//     // res.error("Error deleting task", { error: message }, 500);
//     res.error = message;
//     next(500);
//   }
// };
const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Delegate business logic and persistence to the service
        const deletedTask = await (0, taskServices_1.deleteTaskService)(id);
        res.result = deletedTask;
        next(200); // Success response
    }
    catch (err) {
        const message = err.message || "Error deleting task";
        // Determine the status code from the custom error or default to 500
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode); // Propagate the specific status code
    }
};
exports.deleteTask = deleteTask;
