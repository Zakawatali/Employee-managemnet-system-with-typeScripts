import Joi from "joi";

export const leaveRequestSchema = Joi.object({
    employee: Joi.string()
      .required()
      .messages({
        "string.base": "Employee ID must be a string",
        "any.required": "Employee is required",
      }),
  
    leaveType: Joi.string()
      .valid("CASUAL", "SICK", "ANNUAL", "UNPAID")
      .required()
      .messages({
        "any.only": "Leave type must be CASUAL, SICK, ANNUAL or UNPAID",
        "any.required": "Leave type is required",
      }),
  
    startDate: Joi.date()
      .required()
      .messages({
        "date.base": "Start date must be a valid date",
        "any.required": "Start date is required",
      }),
  
    endDate: Joi.date()
      .greater(Joi.ref("startDate"))
      .required()
      .messages({
        "date.greater": "End date must be after start date",
        "any.required": "End date is required",
      }),
  
    reason: Joi.string()
      .min(5)
      .max(500)
      .required()
      .messages({
        "string.min": "Reason must be at least 5 characters long",
        "string.max": "Reason must not exceed 500 characters",
        "any.required": "Reason is required",
      }),
  });
  