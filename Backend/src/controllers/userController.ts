
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

// Fixed registerUser controller
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

 
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
      role,
      status,
    } = req.body;

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
      role,
      status,
    });

    res.result=newUser;
    next(201);
    
  } catch (err: any) {
    console.error("Registration error:", err);
    
    res.error=err;
    next(500);
  }
};


export const loginUser = async ( req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await LoginUserService(email, password);
     res.result = result;
    next(200); 
  } catch (err) {
    res.error = err;
    next(500);
  }
};

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await GetAllUserService();
    res.result = users;
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
    const { email } = req.body;
    const  user = await ForgetPasswordServices(email);
    res.result =  user;
    next(200);

  } catch (err) {
    res.error = err;
    next(500);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    

    const  Emp = await ResetPasswordService(newPassword, token);
    res.result = Emp;
    next(200);
  } catch (err) {
    res.error = err;
    next(500);
  }
};