// import { Request, Response, NextFunction } from "express";
// import { ObjectSchema } from "joi";

// interface ValidatedRequest extends Request {
//   validated?: {
//     body?: any;
//     query?: any;
//     params?: any;
//     headers?: any;
//   };
// }

// export const validateRequest = (schema: ObjectSchema) => {
//   return (req: ValidatedRequest, res: Response, next: NextFunction) => {
//     const options = {
//       abortEarly: false, // show all errors
//       allowUnknown: false, // extra fields not allowed
//       stripUnknown: true, // remove unknown fields
//     };

//     const dataToValidate = {
//       body: req.body,
//       params: req.params,
//       query: req.query,
//       headers: req.headers,
//     };

//     const { error, value } = schema.validate(dataToValidate, options);

//     if (error) {
//       return next({
//         status: 400,
//         message: "Validation Error",
//         errors: error.details.map((err) => ({
//           field: err.path.join("."),
//           message: err.message,
//         })),
//       });
//     }

//     // Overwrite body safely
//     req.body = value.body;

//     // Attach validated params, query, headers
//     req.validated = {
//       params: value.params,
//       query: value.query,
//       headers: value.headers,
//     };

//     next();
//   };
// };
// import { Request, Response, NextFunction } from "express";
// import { ObjectSchema } from "joi";

// interface ValidatedRequest extends Request {
//   validated?: {
//     body?: any;
//     query?: any;
//     params?: any;
//     headers?: any;
//   };
// }

// export const validateRequest = (schema: ObjectSchema) => {
//   return (req: ValidatedRequest, res: Response, next: NextFunction) => {
//     const options = {
//       abortEarly: false,
//       allowUnknown: false,
//       stripUnknown: true,
//     };

//     const dataToValidate = {
//       body: req.body,
//       params: req.params,
//       query: req.query,
//       headers: req.headers,
//     };

//     const { error, value } = schema.validate(dataToValidate, options);

//     if (error) {
//       res.error={
//         // ✅ OutputHandler expects number
//         message: "Validation Error", // ✅ used by OutputHandler
//         errors: error.details.map((err) => ({
//           field: err.path.join("."), // body.password
//           message: err.message.replace(/"/g, ""), // clean text
//           type: err.type, // optional (safe to add)
//         })),
//       };
//       next(400)
//     }

//     // overwrite validated data
//     req.body = value.body;
//     req.validated = {
//       params: value.params,
//       query: value.query,
//       headers: value.headers,
//     };

//     next();
//   };
// };
import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

interface Validated extends Request {
  validated?: {
    body?: any;
  };
}

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Validated, res: Response, next: NextFunction) => {
    const options = {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    };

    // ✅ ONLY body validation
    const { error, value } = schema.validate(req.body, options);

    if (error) {
      res.error = {
        message: "Validation Error",
        errors: error.details.map((err) => ({
          field: err.path.join("."), // email, password
          message: err.message.replace(/"/g, ""),
          type: err.type,
        })),
      };
      return next(400);
    }

    // ✅ overwrite body with validated & sanitized data
    req.body = value;
    req.validated = { body: value };

    next();
  };
};
