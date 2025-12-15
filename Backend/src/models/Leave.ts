import {
  Schema,
  model,
  Document,
  Types,
  CallbackWithoutResultAndOptionalError,
} from "mongoose";

export type LeaveType = "SICK" | "CASUAL" | "ANNUAL" | "UNPAID";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface ILeave extends Document {
  employee: Types.ObjectId;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  days?: number;
  reason?: string;
  status: LeaveStatus;
  approver?: Types.ObjectId;
}
export type LeaveDocument = ILeave & Document;

const leaveSchema = new Schema<ILeave>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "EmployeeProfile",
      required: true,
      index: true,
    },
    leaveType: {
      type: String,
      enum: ["SICK", "CASUAL", "ANNUAL", "UNPAID"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number },
    reason: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
      default: "PENDING",
    },
    approver: { type: Schema.Types.ObjectId, ref: "EmployeeProfile" },
  },
  { timestamps: true }
);

leaveSchema.pre<ILeave>(
  "save",
  function (next: CallbackWithoutResultAndOptionalError) {
  if (this.startDate > this.endDate) {
    return next(new Error("startDate cannot be after endDate"));
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const startTime = this.startDate.getTime();
  const endTime = this.endDate.getTime();
  this.days = Math.round((endTime - startTime) / msPerDay) + 1;

  if (this.leaveType === "SICK") {
    this.status = "APPROVED";
  }

    next();
  }
);

export default model<ILeave>("Leave", leaveSchema);
