// import { Request, Response } from "express";
// import Employee from "../models/EmployeeProfile";

// export const updateEmployee = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;

//     const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedEmployee) {
//       res.error("Employee not found", {}, 404);
//       return;
//     }

//     res.success("Employee updated successfully", { employee: updatedEmployee }, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error updating employee";
//     res.error("Error updating employee", { error: message }, 500);
//   }
// };

// export const deleteEmployee = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;

//     const deletedEmployee = await Employee.findByIdAndDelete(id);

//     if (!deletedEmployee) {
//       res.error("Employee not found", {}, 404);
//       return;
//     }

//     res.success("Employee deleted successfully", {}, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error deleting employee";
//     res.error("Error deleting employee", { error: message }, 500);
//   }
// };

// export const getAllEmployees = async (
//   _req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const employees = await Employee.find();

//     if (!employees || employees.length === 0) {
//       res.error("No employees found", {}, 404);
//       return;
//     }

//     res.success(
//       "Employees fetched successfully",
//       { employees, count: employees.length },
//       200
//     );
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Server error";
//     res.error("Server error", { message }, 500);
//   }
// };

// export const getEmployeeById = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const employee = await Employee.findById(req.params.id);

//     if (!employee) {
//       res.error("Employee not found", {}, 404);
//       return;
//     }

//     res.success("Employee fetched successfully", { employee }, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Error fetching employee";
//     res.error("Error fetching employee", { error: message }, 500);
//   }
// };
import { Request, Response, NextFunction } from "express";
import * as employeeService from "../Services/employeeServices";



/**
 * Controller to get a single employee profile by ID.
 */
export const getEmployeeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeByIdService(id);

    res.result = { employee };
    next(200);
  } catch (err) {
    
    const message = err.message || "Error fetching employee";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to update an employee profile.
 */
export const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedEmployee = await employeeService.updateEmployeeService(id, updateData);

    res.result = { employee: updatedEmployee };
    next(200);
  } catch (err) {
   
    const message = err.message || "Error updating employee";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to delete an employee profile.
 */
export const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    const result = await employeeService.deleteEmployeeService(id);

    res.result =  result ;
    next(200);
  } catch (err) {
   
    const message = err.message || "Error deleting employee";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to get all employee profiles.
 */
export const getAllEmployees = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await employeeService.getAllEmployeesService();

    res.result = result; // Contains { employees: [], count: N }
    next(200);
  } catch (err) {
    const message = err.message || "Server error";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};