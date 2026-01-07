// Assuming the following models and types exist and are correctly imported
import Leave, { LeaveDocument } from "../models/Leave";
import EmployeeProfile, { EmployeeProfileDocument } from "../models/EmployeeProfile";
import { Types } from "mongoose";


export const createLeave = async (leaveData: any): Promise<LeaveDocument> => {
  const newLeave = new Leave(leaveData);
  return newLeave.save();
};

/**
 * Finds all leave requests, populating employee and approver details.
 * @returns An array of Leave documents.
 */
// repositories/leaveRepository.ts
// export const findAllLeaves = async (page: number, limit: number): Promise<LeaveDocument[]> => {
//   const skip = (page - 1) * limit;

//   return Leave.find()
//     .populate("employee", "firstName lastName email")
//     .populate("approver", "firstName lastName email")
//     .skip(skip)
//     .limit(limit)
//     .exec();
// };
// export const countLeaves = async (): Promise<number> => {
//   return Leave.countDocuments();
// };

import { ApiError } from "../utils/ApiError";

// export const findAllLeaves = async (
//   page: number,
//   limit: number,
//   search?: string,
//   leaveType?: string
// ): Promise<LeaveDocument[]> => {
  
//   try {
//     const skip = (page - 1) * limit;

//     const filter: any = {};

//     if (search) {
//       filter["employee.firstName"] = { $regex: search, $options: "i" };
//     }

//     if (leaveType) {
//       filter.leaveType = leaveType;
//     }
//     // console.log("The fulter data is",filter)
//     // Populate employee and approver
//     return Leave.find(filter)
//       .populate("employee", "firstName lastName email")
//       .populate("approver", "firstName lastName email")
//       .skip(skip)
//       .limit(limit)
//       .exec();
//   } catch (err: any) {
//     throw new ApiError(err.message || "Error fetching leaves from DB", 500);
//   }
// };

// export const countLeaves = async (search?: string, leaveType?: string): Promise<number> => {
//   try {
//     const filter: any = {};
//     if (search) {
//       filter["employee.firstName"] = { $regex: search, $options: "i" };
//     }
//     if (leaveType) {
//       filter.leaveType = leaveType;
//     }

//     return Leave.countDocuments(filter);
//   } catch (err: any) {
//     throw new ApiError(err.message || "Error counting leaves", 500);
//   }
// };

export const findAllLeaves = async (
  page: number,
  limit: number,
  search?: string,
  leaveType?: string
): Promise<LeaveDocument[]> => {
  try {
    const skip = (page - 1) * limit;

    const pipeline: any[] = [
      {
        $lookup: {
          from: "employeeprofiles",
          localField: "employee",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
    ];

    if (search) {
      pipeline.push({
        $match: {
          "employee.firstName": {
            $regex: search,
            $options: "i",
          },
        },
      });
    }

    if (leaveType) {
      pipeline.push({
        $match: { leaveType },
      });
    }

    pipeline.push(
      { $skip: skip },
      { $limit: limit }
    );

    const result = await Leave.aggregate(pipeline).exec();
    return result;
  } catch (err: any) {
  
    throw new ApiError(err.message || "Error fetching leaves from DB", 500);
  }
};


export const countLeaves = async (): Promise<number> => {
  try {
    const totalLeaves = await Leave.countDocuments();
    return totalLeaves;
  } catch (err: any) {
    throw new Error(err.message || "Error counting leaves");
  }
};


/**
 * Finds a single leave request by ID, populating employee and approver details.
 * @param id The ID of the leave request.
 * @returns The Leave document or null if not found.
 */
export const findLeaveById = async (id: string | Types.ObjectId): Promise<LeaveDocument | null> => {
  return Leave.findById(id)
    .populate("employee", "firstName lastName email")
    .populate("approver", "firstName lastName email")
    .exec();
};

/**
 * Finds all leave requests for a specific employee ID.
 * @param employeeId The ID of the employee.
 * @returns An array of Leave documents.
 */
export const findLeavesByEmployeeId = async (employeeId: string): Promise<LeaveDocument[]> => {
  return Leave.find({ employee: employeeId })
    .populate("employee", "firstName lastName email")
    .populate("approver", "firstName lastName email")
    .exec();
};

/**
 * Finds and deletes a leave request by ID.
 * @param id The ID of the leave request to delete.
 * @returns The deleted Leave document or null if not found.
 */
export const deleteLeaveById = async (id: string): Promise<LeaveDocument | null> => {
  return Leave.findByIdAndDelete(id).exec();
};

/**
 * Saves a modified Leave document (used for status updates).
 * @param leave The modified Leave document instance.
 * @returns The saved Leave document.
 */
export const saveLeave = async (leave: LeaveDocument): Promise<LeaveDocument> => {
  return leave.save();
};

/**
 * Finds an employee profile by ID (needed for email details).
 * @param employeeId The ID of the employee profile.
 * @returns The EmployeeProfile document or null if not found.
 */
export const findEmployeeProfileById = async (employeeId: Types.ObjectId): Promise<EmployeeProfileDocument | null> => {
  return EmployeeProfile.findById(employeeId).exec();
};