import Task, { ITask, TaskDocument } from "../models/Task";

export const CreatetaskRepo = async (newTask: ITask): Promise<ITask> => {
  await newTask.save();
  return newTask;
};

export const getalltaskRepo = async (): Promise<ITask[]> => {
  return Task.find()
    .populate("createdBy", "firstName lastName email")
    .populate("assignTo", "firstName lastName email");
};

export const getTaskByIdRepo = async (id: string): Promise<ITask[]> => {
  const tasks = await Task.find({ assignTo: id })
    .populate("createdBy", "firstName lastName email")
    .populate("assignTo", "firstName lastName email");
  return tasks;
};


export const findTaskById = async (taskId: string): Promise<TaskDocument | null> => {
  // Direct interaction with the Mongoose model
  return Task.findById(taskId);
};


export const saveTask = async (task: TaskDocument): Promise<TaskDocument> => {
  // Direct interaction with the Mongoose document method
  return task.save();
};
export const deleteTaskById = async (taskId: string): Promise<TaskDocument | null> => {
  return Task.findByIdAndDelete(taskId);
};