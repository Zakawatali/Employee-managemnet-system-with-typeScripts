
import { Request, Response, NextFunction } from 'express';
import Task from "../models/Task";
import {
  CreatetaskService,
  getAllTaskService,
  getTaskByIdService,
  deleteTaskService,
  updateTaskService,
} from "../Services/taskServices";
import { AuthenticatedRequest } from "../middlewares/authmiddlewares";


export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const newTask = await CreatetaskService({
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
  } catch (err) {
      // const message = error instanceof Error ? error.message : "Server error";
      const message = err instanceof Error ? err.message : "Server error";
    // res.error("Server error", { error: message }, 500);
    res.error = message;
    next(500);
  }
};

// export const getAllTasks = async (
//   _req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const tasks = await getAllTaskService();
//       // res.success("Tasks fetched successfully", { tasks, count: tasks.length }, 200);
//       res.result = tasks;
//       next(200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error fetching tasks";
//     // res.error("Error fetching tasks", { error: message }, 500);
//     res.error = message;
//     next(500);
//   }
// };
export const getAllTasks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getAllTaskService(page, limit);

    res.result = result;
    next(200);

  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error fetching tasks";

    res.error = message;
    next(500);
  }
};

// export const getTaskById = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const task = await getTaskByIdService(id);

//     if (!task || task.length === 0) {
//       res.error = "Task not found";
//       next(404);
//       return;
//     }
//     res.result = task;
//     next(200);
//   } catch (err) {
//     const message = err instanceof Error ? err.message : "Error fetching task";
//     res.error = message;
//     next(500);
//   }
// };
export const getTaskById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // pagination params
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getTaskByIdService(id, page, limit);

    if (!result.tasks.length) {
      res.error = "Task not found";
      next(404);
      return;
    }

    res.result = result;
    next(200);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error fetching task";
    res.error = message;
    next(500);
  }
};

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
export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const updatedTask = await updateTaskService(id, updatePayload, user);

    res.result = updatedTask;
    next(200); // Success response
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error updating task";
    
    // Safely determine the status code for known application errors
    const statusCode = err instanceof Error && 'statusCode' in err && typeof err.statusCode === 'number'
        ? err.statusCode
        : 500;

    res.error = message;
    next(statusCode); // Propagate the specific status code
  }
};
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

export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Delegate business logic and persistence to the service
    const deletedTask = await deleteTaskService(id);

    res.result = deletedTask;
    next(200); // Success response
  } catch (err) {
    
    const message = err.message || "Error deleting task";
    
    // Determine the status code from the custom error or default to 500
    const statusCode = err.statusCode || 500;

    res.error = message;
    next(statusCode); // Propagate the specific status code
  }
};