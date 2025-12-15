// import { Request, Response } from "express";
// import { Types } from "mongoose";
// import Achievement from "../models/Achievement";

// export const createAchievement = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { user, title, body } = req.body;

//     const achievement = new Achievement({ user, title, body });
//     await achievement.save();

//     res.success("Achievement created successfully", { achievement }, 201);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error creating achievement";
//     res.error("Error creating achievement", { message }, 500);
//   }
// };

// export const getAllAchievements = async (
//   _req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const achievements = await Achievement.find().populate(
//       "user",
//       "firstName lastName email"
//     );
//     res.success("Achievements fetched successfully", { achievements }, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error fetching achievements";
//     res.error("Error fetching achievements", { message }, 500);
//   }
// };

// export const getAchievementById = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { employeeId } = req.params;

//     if (!employeeId) {
//       res.error("Employee ID is required", {}, 400);
//       return;
//     }

//     if (!Types.ObjectId.isValid(employeeId)) {
//       res.error("Invalid Employee ID format", {}, 400);
//       return;
//     }

//     const achievements = await Achievement.find({ user: employeeId }).populate(
//       "user",
//       "firstName lastName email"
//     );

//     if (!achievements || achievements.length === 0) {
//       res.error("No achievements found for this employee", {}, 404);
//       return;
//     }

//     res.success(
//       "Achievements fetched successfully",
//       { totalAchievements: achievements.length, data: achievements },
//       200
//     );
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Server error while fetching achievements";
//     res.error("Server error while fetching achievements", { error: message }, 500);
//   }
// };

// export const updateAchievement = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { title, body } = req.body;

//     const achievement = await Achievement.findByIdAndUpdate(
//       req.params.id,
//       { title, body },
//       { new: true }
//     );

//     if (!achievement) {
//       res.error("Achievement not found", {}, 404);
//       return;
//     }

//     res.success("Achievement updated", { achievement }, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error updating achievement";
//     res.error("Error updating achievement", { message }, 500);
//   }
// };

// export const deleteAchievement = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const achievement = await Achievement.findByIdAndDelete(req.params.id);
//     if (!achievement) {
//       res.error("Achievement not found", {}, 404);
//       return;
//     }
//     res.success("Achievement deleted", { achievement }, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error deleting achievement";
//     res.error("Error deleting achievement", { message }, 500);
//   }
// };
import { Request, Response, NextFunction } from "express";
import * as achievementService from "../Services/achievementServices";
import { AuthenticatedRequest } from "../middlewares/authmiddlewares";


/**
 * Controller to create a new achievement.
 */
export const createAchievement = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user, title, body } = req.body;
    const achievementData = { user, title, body };

    const achievement = await achievementService.createAchievementService(achievementData);

    res.result = { achievement };
    next(201);
  } catch (err) {
   
    const message = err.message || "Error creating achievement";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to get all achievements.
 */
export const getAllAchievements = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const achievements = await achievementService.getAllAchievementsService();

    res.result = { achievements };
    next(200);
  } catch (err) {
    
    const message = err.message || "Error fetching achievements";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to get achievements by employee ID.
 */
export const getAchievementById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { employeeId } = req.params;

    const result = await achievementService.getAchievementsByEmployeeService(employeeId);

    res.result = result; // Contains { totalAchievements, data }
    next(200);
  } catch (err) {
   
    const message = err.message || "Server error while fetching achievements";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to update an existing achievement.
 */
export const updateAchievement = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, body } = req.body;
    const { id } = req.params;

    const updateData = { title, body };

    const achievement = await achievementService.updateAchievementService(
      id,
      updateData
    );

    res.result =  achievement ;
    next(200);
  } catch (err) {
    
    const message = err.message || "Error updating achievement";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to delete an achievement.
 */
export const deleteAchievement = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    const achievement = await achievementService.deleteAchievementService(id);

    res.result =  achievement ;
    next(200);
  } catch (err) {
    
    const message = err.message || "Error deleting achievement";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};