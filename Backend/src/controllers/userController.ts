
import { Request, Response, NextFunction } from "express";
import {
  LoginUserService,
  RegisterUserService,
  GetAllUserService,
  ApproveUserServices,
  RejectUserServices,
  ForgetPasswordServices,
  ResetPasswordService,
} from "../Services/userServices";
import { error } from "console";
import { LoginDto , RegisterUserDto , ForgetPasswordDto , ResetPasswordDto } from "../dtos/authDtos";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { SUCCESS_MESSAGES } from "../constants/successMessages";


// Fixed registerUser controller
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

 const registerUserDto: RegisterUserDto = req.body;
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      dateOfBirth,
      department,
      position,
      experience,
      education,
    } = registerUserDto;

    // Get the uploaded image path from multer
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    // if (
    //   !firstName ||
    //   !lastName ||
    //   !email ||
    //   !password ||
    //   !department ||
    //   !position
    // ) {
    //   res.error = "Please fill all required fields";
    //   next(400);
    //   return; // ✅ stops execution her
    // }

    const { newUser } = await RegisterUserService({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      dateOfBirth,
      department,
      position,
      experience,
      education,
      image: imagePath, // Pass the file path instead
      
    });

    res.result=newUser;
    next(201);
    
  } catch (err: any) {
    const message = err instanceof Error ? err.message : "Error updating task";
    
    // Safely determine the status code for known application errors
    const statusCode = err instanceof Error && 'statusCode' in err && typeof err.statusCode === 'number'
        ? err.statusCode
        : 500;
    res.error = message;
    next(statusCode);
  }
};


export const loginUser = async ( req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loginDto: LoginDto = req.body;
    const { email, password } = loginDto;
    const result = await LoginUserService(email, password);
     res.result = result;
    next(200); 
  } catch (err) {
    const message = err instanceof Error ? err.message :"error in login user";
    
    // Safely determine the status code for known application errors
    const statusCode = err instanceof Error && 'statusCode' in err && typeof err.statusCode === 'number'
        ? err.statusCode
        : 500;
     
    res.error = message;
    next(statusCode); 
  }
};

// export const getAllUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const users = await GetAllUserService();
//     res.result = users;
//     next(200);
//   } catch (err) {
//     res.error = err;
//     next(500);
//   }
// };
// export const getAllUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const page = parseInt(_req.query.page as string) || 1;
//     const limit = parseInt(_req.query.limit as string) || 10;

//     const result = await GetAllUserService(page, limit);

//     res.result = result;
//     next(200);
//   } catch (err) {
//     res.error = err;
//     next(500);
//   }
// };
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const result = await GetAllUserService(page, limit, search);

    res.result = result;
    next(200);
  } catch (err) {
    res.error = err;
    next(500);
  }
};


export const approveUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const { employeeProfile } = await ApproveUserServices(userId);
    res.result = employeeProfile;
    next(200);
  } catch (err) {
    res.error = err;
    next(500);
  }
};

export const rejectUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const { user } = await RejectUserServices(userId);
    res.result = user;
    next(200);
  } catch (err) {
    res.error = err;
    next(500);
  }
};

export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const forgetPasswordDto: ForgetPasswordDto = req.body;
    const { email } = forgetPasswordDto;
    const  user = await ForgetPasswordServices(email);
    res.result =  user;
    next(200);

  } catch (err: any) {
    res.error = err.message || "Failed to process forget password request";
    const statusCode = err.statusCode || 500;
    next(statusCode);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;
    const resetPasswordDto: ResetPasswordDto = req.body;
    const { newPassword } = resetPasswordDto;

    

    const  Emp = await ResetPasswordService(newPassword, token);
    res.result = Emp;
    next(200);
  } catch (err: any) {
    res.error = err.message || "Failed to reset password";
    const statusCode = err.statusCode || 500;
    next(statusCode);
  }
};