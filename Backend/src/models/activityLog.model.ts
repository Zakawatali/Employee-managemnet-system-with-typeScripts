import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * Activity Log document interface
 */
export interface IActivityLog extends Document {
  user?: Types.ObjectId | null;
  action: string;
  module: string;
  method?: string;
  endpoint?: string;
  requestData?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: "SUCCESS" | "FAILED";
  errorMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Activity Log schema
 */
const activityLogSchema = new Schema<IActivityLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    action: {
      type: String,
      required: true,
      index: true,
    },

    module: {
      type: String,
      required: true,
    },

    method: {
      type: String,
    },

    endpoint: {
      type: String,
    },

    requestData: {
      type: Schema.Types.Mixed,
    },

    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS",
    },

    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Export model (prevents overwrite in dev)
 */
const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);

export default ActivityLog;
