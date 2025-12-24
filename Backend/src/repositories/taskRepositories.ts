import Task, { ITask, TaskDocument } from "../models/Task";
import mongoose, { PipelineStage } from "mongoose";

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
// export const getalltaskRepo = async (
//   page: number,
//   limit: number
// ): Promise<{ tasks: ITask[]; total: number }> => {

//   const skip = (page - 1) * limit;

//   const [tasks, total] = await Promise.all([
//     Task.find()
//       .populate("createdBy", "firstName lastName email")
//       .populate("assignTo", "firstName lastName email")
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 }),

//     Task.countDocuments()
//   ]);

//   return { tasks, total };
// };
export const getalltaskRepo = async (
  page: number,
  limit: number,
  status?: string,
  priority?: string,
  assignTo?: string
): Promise<{ tasks: ITask[]; total: number }> => {
  const skip = (page - 1) * limit;

  const pipeline: any[] = [];

  // Lookup for assignTo user
  pipeline.push(
    {
      $lookup: {
        from: "employeeprofiles",  // use exact MongoDB collection name
        localField: "assignTo",
        foreignField: "_id",
        as: "assignTo"
      }
    },
    {
      $unwind: {
        path: "$assignTo",
        preserveNullAndEmptyArrays: true
      }
    }
  );
  

  // Match stage for status, priority, and assignTo name
  const match: any = {};
  if (status) match.status = status;
  if (priority) match.priority = priority;
  if (assignTo) {
    match["assignTo.firstName"] = { $regex: assignTo, $options: "i" };
  }

  if (Object.keys(match).length > 0) {
    pipeline.push({ $match: match });
  }

  

  // Sort, skip, limit
  pipeline.push({ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit });

  // Project fields
  pipeline.push({
    $project: {
      title: 1,
      description: 1,
      status: 1,
      priority: 1,
      dueDate:1,
      createdAt: 1,
      assignTo: {
        firstName: 1,
        lastName: 1,
        email: 1
      }
    }
  });

  // Execute aggregation
  const tasks = await Task.aggregate(pipeline);
 

  // Total count after filters
  const countPipeline = [...pipeline];
  const skipIndex = countPipeline.findIndex((s) => s.$skip !== undefined);
  if (skipIndex >= 0) countPipeline.splice(skipIndex, 2); // remove skip & limit
  countPipeline.push({ $count: "total" });

  const totalCountResult = await Task.aggregate(countPipeline);
  

  const total = totalCountResult[0]?.total || 0;

  return { tasks, total };
};





// export const getTaskByIdRepo = async (id: string): Promise<ITask[]> => {
//   const tasks = await Task.find({ assignTo: id })
//     .populate("createdBy", "firstName lastName email")
//     .populate("assignTo", "firstName lastName email");
//   return tasks;
// };
// export const getTaskByIdRepo = async (
//   id: string,
//   page: number,
//   limit: number
// ): Promise<PaginatedTasks> => {
//   const skip = (page - 1) * limit;

//   const [tasks, total] = await Promise.all([
//     Task.find({ assignTo: id })
//       .populate("createdBy", "firstName lastName email")
//       .populate("assignTo", "firstName lastName email")
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 }),

//     Task.countDocuments({ assignTo: id }),
//   ]);

//   return {
//     tasks,
//     total,
//     page,
//     totalPages: Math.ceil(total / limit),
//   };
// };



export const getTaskByIdRepo = async (
  id: string,
  page: number,
  limit: number,
  status?: string,
  priority?: string
): Promise<PaginatedTasks> => {
  const skip = (page - 1) * limit;
  const assignToId = new mongoose.Types.ObjectId(id);
  // Build dynamic match object
  const matchConditions: any = { assignTo: assignToId };
  if (status) matchConditions.status = status;
  if (priority) matchConditions.priority = priority;


  // Aggregation pipeline
  const aggregatePipeline: PipelineStage[] = [
    { $match: matchConditions },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "employeeprofiles",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      $lookup: {
        from: "employeeprofiles",
        localField: "assignTo",
        foreignField: "_id",
        as: "assignTo",
      },
    },
    { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$assignTo", preserveNullAndEmptyArrays: true } },
    { $skip: skip },
    { $limit: limit },
  ];
  const tasks = await Task.aggregate(aggregatePipeline);
  // Total count for pagination
  const total = await Task.countDocuments(matchConditions);
  console.log("Total Count:", total);

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