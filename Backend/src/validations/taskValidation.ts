import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 3 characters",
    }),

  description: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required()
    .messages({
      "string.empty": "Description is required",
    }),

  priority: Joi.string()
    .valid("LOW", "MEDIUM", "HIGH")
    .required()
    .messages({
      "any.only": "Priority must be LOW, MEDIUM, or HIGH",
    }),

  dueDate: Joi.date()
    .greater("now")
    .required()
    .messages({
      "date.greater": "Due date must be in the future",
    }),

  assignTo: Joi.string()
    .required()
    .messages({
      "string.empty": "Employee  is required that you want to assign task",
    }),
});
