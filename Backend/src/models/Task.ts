import { Schema, model, Document, Types } from "mongoose";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "DONE"
  | "COMPLETED"
  | "BLOCKED"
  | "DELAYED";

export interface ITask extends Document {
  title: string;
  description?: string;
  createdBy: Types.ObjectId;
  priority: TaskPriority;
  dueDate?: Date;
  assignTo: Types.ObjectId;
  status: TaskStatus;
  assignedAt: Date;
}
export type TaskDocument = ITask & Document; 

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "EmployeeProfile",
      required: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    dueDate: { type: Date },
    assignTo: {
      type: Schema.Types.ObjectId,
      ref: "EmployeeProfile",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "DONE", "COMPLETED", "BLOCKED", "DELAYED"],
      default: "PENDING",
    },
    assignedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model<ITask>("Task", taskSchema);
