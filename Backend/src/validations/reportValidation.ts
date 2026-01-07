import Joi from "joi";

export const uploadDocumentSchema = Joi.object({
  employee: Joi.string()
    .required()
    .messages({
      "string.empty": "Employee is required",
      "any.required": "Employee is required",
    }),

  kind: Joi.string()
    .valid("CNIC", "CONTRACT", "OFFER_LETTER", "OTHER")
    .required()
    .messages({
      "any.only": "Invalid document kind",
      "any.required": "Document kind is required",
    }),

  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.min": "Title must be at least 3 characters",
      "any.required": "Title is required",
    }),

});
