import Joi from "joi";

export const createAchievementSchema = Joi.object({
  user: Joi.string()
    .required()
    .messages({
      "any.required": "employee is required",
      "string.empty": "employee is required",
    }),

  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.base": "Title must be a string",
      "string.empty": "Title is required",
      "string.min": "Title must be at least 3 characters",
      "string.max": "Title must not exceed 100 characters",
      "any.required": "Title is required",
    }),

  body: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      "string.base": "Description must be a string",
      "string.empty": "Description is required",
      "string.min": "Description must be at least 10 characters",
      "string.max": "Description must not exceed 1000 characters",
      "any.required": "Description is required",
    }),
});
