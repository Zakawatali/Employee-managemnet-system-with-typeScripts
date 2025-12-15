import * as Joi from "joi";
import { ObjectSchema } from "joi";

// ------------------- Login Schema -------------------
export const loginSchema: ObjectSchema = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
      }),
  }).required(),

  params: Joi.object({}).default({}),
  query: Joi.object({}).default({}),
});

// ------------------- Register Schema -------------------

// Enums matching your model
export const departments = ["HR", "IT", "Finance", "Marketing", "Sales"] as const;
export const positions = ["Manager", "Team Lead", "Developer", "Designer", "Intern", "HR"] as const;
export const roles = ["HR", "Employee", "Admin"] as const;
export const employmentStatus = ["PENDING", "ACTIVE", "SUSPENDED", "TERMINATED"] as const;

export const registerSchema: ObjectSchema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().min(2).max(50).required().messages({
      "string.empty": "First name is required",
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name must be less than 50 characters",
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name must be less than 50 characters",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Email must be valid",
      "string.empty": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "string.empty": "Password is required",
    }),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    department: Joi.string().valid(...departments).required().messages({
      "any.only": `Department must be one of ${departments.join(", ")}`,
      "string.empty": "Department is required",
    }),
    position: Joi.string().valid(...positions).required().messages({
      "any.only": `Position must be one of ${positions.join(", ")}`,
      "string.empty": "Position is required",
    }),
    experience: Joi.string().optional(),
    education: Joi.string().optional(),
    role: Joi.string().valid(...roles).default("Employee"),
    image: Joi.string().optional(),
    status: Joi.string().valid(...employmentStatus).default("PENDING"),
  }).required(),

  params: Joi.object({}).default({}),
  query: Joi.object({}).default({}),
});

//// Approve User
export const approveUserSchema = Joi.object({
    params: Joi.object({
      userId: Joi.string()
        .length(24)
        .hex()
        .required()
        .messages({
          "string.length": "User ID must be 24 characters",
          "string.hex": "User ID must be a valid hex string",
          "any.required": "User ID is required",
        }),
    }).required(),
  
    // Optional headers validation (e.g., Authorization)
    headers: Joi.object({
      authorization: Joi.string().required().messages({
        "any.required": "Authorization header is required",
      }),
    }).unknown(true), // keep unknown headers
  });


  ///// forget email

export const forgetPasswordSchema = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
      }),
  }).required(),

  // Optional headers (e.g., for Authorization, tracking, etc.)
  headers: Joi.object().unknown(true), // keep unknown headers
});

// Reset Password

export const resetPasswordSchema = Joi.object({
  params: Joi.object({
    token: Joi.string()
      .required()
      .messages({
        "string.empty": "Token is required",
        "any.required": "Token is required",
      }),
  }).required(),

  body: Joi.object({
    newPassword: Joi.string()
      .min(6)
      .required()
      .messages({
        "string.min": "Password must be at least 6 characters",
        "string.empty": "New password is required",
        "any.required": "New password is required",
      }),
  }).required(),

  // Optional headers validation
  headers: Joi.object().unknown(true),
});
