import * as Joi from "joi";
import { ObjectSchema } from "joi";

// ------------------- Login Schema -------------------
// export const loginSchema: ObjectSchema = Joi.object({
//   body: Joi.object({
//     email: Joi.string()
//       .email()
//       .required()
//       .messages({
//         "string.email": "Email must be a valid email address",
//         "any.required": "Email is required",
//       }),
//     password: Joi.string()
//       .min(6)
//       .required()
//       .messages({
//         "string.min": "Password must be at least 6 characters long",
//         "any.required": "Password is required",
//       }),
//   }).required(),

//   params: Joi.object({}).default({}),
//   query: Joi.object({}).default({}),
// });
export const loginSchema: ObjectSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email is required",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
      "string.empty": "Password is required",
    }),
});
// ------------------- Register Schema -------------------

// Enums matching your model




export const departments = ["HR", "IT", "Finance", "Marketing", "Sales"] as const;
export const positions = ["Manager", "Team Lead", "Developer", "Designer", "Intern", "HR"] as const;
export const roles = ["HR", "Employee", "Admin"] as const;
export const employmentStatus = ["PENDING", "ACTIVE", "SUSPENDED", "TERMINATED"] as const;

export const registerSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "First name is required",
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name must be at most 50 characters",
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name must be at most 50 characters",
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "string.empty": "Email is required",
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.empty": "Password is required",
    }),
    phone: Joi.string()
    .pattern(/^\d{9,12}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone must be a number between 9 and 12 digits",
      "string.empty": "Phone is required",
    }),
    address: Joi.string()
    .min(5)
    .max(250)
    .required()
    .messages({
      "string.min": "Address must be at least 5 characters",
      "string.max": "Address must be at most 250 characters",
      "string.empty": "Address is required",
    }),
  
  dateOfBirth: Joi.string().optional(),
  department: Joi.string()
    .valid(...departments)
    .required()
    .messages({
      "any.only": `Department must be one of ${departments.join(", ")}`,
      "string.empty": "Department is required",
    }),
  position: Joi.string()
    .valid(...positions)
    .required()
    .messages({
      "any.only": `Position must be one of ${positions.join(", ")}`,
      "string.empty": "Position is required",
    }),
    experience: Joi.string()
    .min(1)
    .required()
    .messages({
      "string.empty": "Experience is required",
    }),
  education: Joi.string()
    .min(1)
    .required()
    .messages({
      "string.empty": "Education is required",
    }),
  
  role: Joi.string()
    .valid(...roles)
    .default("Employee")
    .messages({
      "any.only": `Role must be one of ${roles.join(", ")}`,
    }),
  status: Joi.string()
    .valid(...employmentStatus)
    .default("PENDING")
    .messages({
      "any.only": `Status must be one of ${employmentStatus.join(", ")}`,
    }),
  image: Joi.any().optional(), // multer handles file
});








  ///// forget email


  export const forgetPasswordSchema: ObjectSchema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "Email must be a valid email address",
        "string.empty": "Email is required",
        "any.required": "Email is required",
      }),
  });

  

// Reset Password

export const resetPasswordSchema: ObjectSchema = Joi.object({
  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.empty": "New password is required",
      "any.required": "New password is required",
    }),
});
