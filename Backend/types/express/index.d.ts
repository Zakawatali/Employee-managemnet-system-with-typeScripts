import "express-serve-static-core";
import { EmployeeProfileDocument } from "../../src/models/EmployeeProfile";

declare module "express-serve-static-core" {
  interface Response {
    // ⬅️ Change: Define 'result' as a property that can hold any data (for successful response body)
    result?: any; 
    
    // ⬅️ Change: Define 'error' as a property that can hold any error object or message
    error?: any; 
    
    // If your output middleware uses 'exception' for uncaught errors, add it here too
    exception?: any;
      success?: (data?: any) => void;   // Add method if you want
     
  }

  interface Request {
    user?: EmployeeProfileDocument | null;
  }
}