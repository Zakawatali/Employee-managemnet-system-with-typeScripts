import Task, { ITask, TaskDocument } from "../models/Task";
interface PaginatedTasks {
  tasks: ITask[];
  total: number;
  page: number;
  totalPages: number;
}
export const CreatetaskRepo = async (newTask: ITask): Promise<ITask> => {
  await newTask.save();
  return newTask;
};

// export const getalltaskRepo = async (): Promise<ITask[]> => {
//   return Task.find()
//     .populate("createdBy", "firstName lastName email")
//     .populate("assignTo", "firstName lastName email");
// };
export const getalltaskRepo = async (
  page: number,
  limit: number
): Promise<{ tasks: ITask[]; total: number }> => {

  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find()
      .populate("createdBy", "firstName lastName email")
      .populate("assignTo", "firstName lastName email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    Task.countDocuments()
  ]);

  return { tasks, total };
};

// export const getTaskByIdRepo = async (id: string): Promise<ITask[]> => {
//   const tasks = await Task.find({ assignTo: id })
//     .populate("createdBy", "firstName lastName email")
//     .populate("assignTo", "firstName lastName email");
//   return tasks;
// };
export const getTaskByIdRepo = async (
  id: string,
  page: number,
  limit: number
): Promise<PaginatedTasks> => {
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find({ assignTo: id })
      .populate("createdBy", "firstName lastName email")
      .populate("assignTo", "firstName lastName email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    Task.countDocuments({ assignTo: id }),
  ]);

  return {
    tasks,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
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