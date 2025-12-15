import Task, { ITask, TaskPriority,TaskDocument} from "../models/Task";

import {
  CreatetaskRepo,
  getalltaskRepo,
  getTaskByIdRepo,
  deleteTaskById,
} from "../repositories/taskRepositories";

interface CreateTaskDTO {
  userid: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date | string;
  assignTo: string;
}

export const CreatetaskService = async (
  task: CreateTaskDTO
): Promise<ITask> => {
  const { userid, title, description, priority, dueDate, assignTo } = task;

  const createTask = new Task({
    title,
    description,
    createdBy: userid,
    priority,
    dueDate,
    assignTo,
  });

  return CreatetaskRepo(createTask);
};

export const getAllTaskService = async (): Promise<ITask[]> => {
  return getalltaskRepo();
};

export const getTaskByIdService = async (id: string): Promise<ITask[]> => {
  return getTaskByIdRepo(id);
};
// Update Task
// Assuming types and imports

import { AuthenticatedRequest} from '../middlewares/authmiddlewares'; // Assuming this defines req.user structure
import * as taskRepository from '../repositories/taskRepositories';




export const updateTaskService = async (
  taskId: string,
  updatePayload: any,
  user: AuthenticatedRequest['user']
): Promise<TaskDocument> => {
  // 1. Fetch Task from Repository
  const task = await taskRepository.findTaskById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  // 2. Apply Business Logic and Authorization Checks
  if (user.role === "Employee") {
    // Check if the Employee is authorized (assigned to this task)
    if (task.assignTo.toString() !== user._id.toString()) {
      throw new Error("Not authorized to update this task");
    }
    
    // Employees are only allowed to update the 'status' field
    if (updatePayload.status) {
      task.status = updatePayload.status;
    }
  } else {
    // Manager/Admin roles can update any field via Object.assign
    Object.assign(task, updatePayload);
  }

  // 3. Save updated task via Repository
  const updatedTask = await taskRepository.saveTask(task);
  
  return updatedTask;
};
// Delete Task
export const deleteTaskService = async (taskId: string): Promise<TaskDocument> => {
  // Database interaction via Repository
  const deletedTask = await deleteTaskById(taskId);

  if (!deletedTask) {
    // Business logic: Task must exist to be deleted
   
    throw new Error("Task not found");

  }
  
  return deletedTask;
};