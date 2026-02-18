import ActivityLog, { IActivityLog } from "../models/activityLog.model";

/**
 * Centralized activity logger
 * Uses schema-based typing to avoid mongoose overload issues
 */
export const logActivity = async (
  payload: Partial<IActivityLog>
): Promise<void> => {
  try {
    const log = new ActivityLog(payload);
    await log.save();
  } catch (error) {
    console.error(
      "Activity Log Error:",
      (error as Error).message
    );
  }
};