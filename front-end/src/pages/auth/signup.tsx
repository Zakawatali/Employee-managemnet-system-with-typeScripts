
// import React, { useState, ChangeEvent, FormEvent } from "react";
// import {
//   User,
//   Mail,
//   Lock,
//   Phone as PhoneIcon,
//   Calendar,
//   Building2,
//   BriefcaseBusiness,
//   GraduationCap,
//   BadgeCheck,
//   Loader2,
//   Eye,
//   EyeOff,
// } from "lucide-react";
// import axios from "../../util/axiosInstance.js";
// import { Link, useNavigate } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";

// // Regex
// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
// const phoneRegex = /^[0-9+\-()\s]{6,}$/;

// // Options
// const DEPARTMENTS = ["HR", "IT", "Finance", "Marketing", "Sales"] as const;
// const POSITIONS = ["Manager", "Team Lead", "Developer", "Designer", "Intern", "HR"] as const;
// const EDUCATION = ["Matric", "Intermediate", "Bachelor", "Master", "MPhil", "PhD", "Other"] as const;

// // Form data type
// interface FormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   phone: string;
//   address: string;
//   dateOfBirth: string;
//   department: string;
//   position: string;
//   experience: string;
//   education: string;
//   imagePreview: string | null; // For preview only
//   imageFile: File | null; // For actual upload
// }

// // Form errors type
// type FormErrors = Partial<Record<keyof FormData, string>>;

// // Initial form
// const initialForm: FormData = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   password: "",
//   phone: "",
//   address: "",
//   dateOfBirth: "",
//   department: "",
//   position: "",
//   experience: "",
//   education: "",
//   imagePreview: null,
//   imageFile: null,
// };

// // Field props type
// interface FieldProps {
//   label: string;
//   name: keyof FormData;
//   icon?: React.ElementType;
//   type?: string;
//   value?: string;
//   onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//   error?: string;
//   options?: readonly string[];
//   placeholder?: string;
//   children?: React.ReactNode;
// }

// // Field component
// const Field: React.FC<FieldProps> = ({
//   label,
//   name,
//   icon: Icon,
//   type = "text",
//   value,
//   onChange,
//   error,
//   options,
//   placeholder,
//   children,
// }) => (
//   <div className="flex flex-col gap-1">
//     <label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</label>
//     <div className="relative flex items-center rounded-xl border bg-white focus-within:ring-2 focus-within:ring-indigo-500 shadow-sm">
//       {Icon && <Icon className="absolute left-3 h-5 w-5 text-gray-400" />}
//       {options ? (
//         <select
//           id={name}
//           name={name}
//           value={value}
//           onChange={onChange}
//           className="w-full rounded-xl bg-transparent pl-10 pr-3 py-2 outline-none text-gray-900"
//         >
//           <option value="">Select {label.toLowerCase()}</option>
//           {options.map(o => <option key={o} value={o}>{o}</option>)}
//         </select>
//       ) : children ? (
//         children
//       ) : (
//         <input
//           id={name}
//           name={name}
//           type={type}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className="w-full rounded-xl bg-transparent pl-10 pr-3 py-2 outline-none text-gray-900 placeholder:text-gray-400"
//         />
//       )}
//     </div>
    
//   </div>
// );

// // Main component
// const SignUpPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<FormData>(initialForm);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         setErrors({ ...errors, imageFile: "Please select a valid image file" });
//         return;
//       }
      
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         setErrors({ ...errors, imageFile: "Image size should be less than 5MB" });
//         return;
//       }

//       // Store the actual file for upload
//       setFormData(prev => ({ ...prev, imageFile: file }));
      
//       // Create preview URL for display
//       const reader = new FileReader();
//       reader.onload = () => {
//         setFormData(prev => ({ ...prev, imagePreview: reader.result as string }));
//       };
//       reader.readAsDataURL(file);
      
//       // Clear any previous error
//       setErrors({ ...errors, imageFile: "" });
//     }
//   };

  

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
    
    

//     try {
//       setSubmitting(true);

//       // Create FormData object
//       const form = new FormData();
      
//       // Append all text fields
//       form.append("firstName", formData.firstName.trim());
//       form.append("lastName", formData.lastName.trim());
//       form.append("email", formData.email.trim().toLowerCase());
//       form.append("password", formData.password);
//       form.append("phone", formData.phone.trim());
//       form.append("address", formData.address.trim());
//       form.append("dateOfBirth", formData.dateOfBirth);
//       form.append("department", formData.department);
//       form.append("position", formData.position);
//       form.append("experience", formData.experience);
//       form.append("education", formData.education);
      
//       // Append the image file if exists
//       if (formData.imageFile) {
//         form.append("image", formData.imageFile);
//       }

//       console.log("Submitting registration...");

//       // Make the API call
//       const { data } = await axios.post("/api/users/signup", form, {
//         headers: { 
//           "Content-Type": "multipart/form-data" 
//         },
//       });

//       console.log("Response received:", data);

//       // Check for successful response
//       if (data.success || data.user) {
//         toast.success(data.message || "Registration successful! Please wait for admin approval.");
        
//         // Reset form
//         setFormData(initialForm);
//         setErrors({});
        
//         // Redirect to login after 2 seconds
//         setTimeout(() => {
//           navigate("/login");
//         }, 2000);
//       } else {
//         toast.error(data.message || "Registration failed");
//       }
      
//     } catch (err: any) {
//       const data = err?.response?.data?.message;

//       // ✅ Joi validation errors
//       if (data?.errors?.length) {
//         const fieldErrors: any = {};
    
//         data.errors.forEach((e: any) => {
//           if (e.field) {
//             fieldErrors[e.field] = e.message;
//           }
//         });
    
//         setErrors(fieldErrors);
//         return;
//       } else {
//         toast.error(
//           err?.response?.data?.message || err?.response?.data?.error || err.message
//         );
      
     
//   }}
  
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 px-4">
//       <Toaster position="top-right" reverseOrder={false} />
      
//       <div className="w-full max-w-4xl my-8 bg-white rounded-3xl shadow-xl p-8 md:p-12">
//         <div className="text-center mb-6">
//           <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
//           <p className="text-sm text-gray-500 mt-2">Fill in the details below to get started</p>
//         </div>

//         {/* Profile Image Upload */}
//         <div className="flex flex-col items-center mb-6">
//           <div className="relative w-28 h-28 group">
//             {formData.imagePreview ? (
//               <img 
//                 src={formData.imagePreview} 
//                 alt="profile preview" 
//                 className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 shadow-md" 
//               />
//             ) : (
//               <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 border-4 border-gray-300 shadow-md">
//                 <User className="w-12 h-12" />
//               </div>
//             )}
            
//             {/* Overlay on hover */}
//             <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//               <span className="text-white text-xs font-medium">Change</span>
//             </div>
            
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
//               title="Upload profile picture"
//             />
//           </div>
          
//           {errors.imageFile && <p className="text-xs text-red-600 mt-2">{errors.imageFile}</p>}
//           <p className="text-sm text-gray-500 mt-2">Upload Profile Picture (Optional)</p>
//         </div>

//         {/* Registration Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid sm:grid-cols-2 gap-4">
//             <Field 
//               label="First Name" 
//               name="firstName" 
//               icon={User} 
//               value={formData.firstName} 
//               onChange={handleChange} 
               
//               placeholder="Usman" 
//             />
//             {errors.firstName && (
//                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
//                 )}
//             <Field 
//               label="Last Name" 
//               name="lastName" 
//               icon={User} 
//               value={formData.lastName} 
//               onChange={handleChange} 
              
//               placeholder="Ali" 
//             />
//             {errors.lastName && (
//                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
//                 )}
//             <Field 
//               label="Email" 
//               name="email" 
//               icon={Mail} 
//               type="email" 
//               value={formData.email} 
//               onChange={handleChange} 
               
//               placeholder="you@example.com" 
//             />
//             {errors.email && (
//                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//                 )}
//             <Field 
//               label="Password" 
//               name="password" 
//               icon={Lock} 
              
//             >
//               {errors.password && (
//                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//                 )}
//               <div className="relative w-full">
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   className="w-full rounded-xl bg-transparent pl-10 pr-10 py-2 outline-none text-gray-900 placeholder:text-gray-400"
//                 />
//                  {errors.password && (
//                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//                 )}
//                 <button 
//                   type="button" 
//                   onClick={() => setShowPassword(!showPassword)} 
//                   className="absolute inset-y-0 right-2 grid place-items-center px-2 text-gray-500 hover:text-gray-700"
//                   title={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                 </button>
//               </div>
//             </Field>
//             <Field 
//               label="Phone" 
//               name="phone" 
//               icon={PhoneIcon} 
//               value={formData.phone} 
//               onChange={handleChange} 
             
//               placeholder="03XX-XXXXXXX" 
//             />
//              {errors.phone && (
//                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
//                 )}
//             <Field 
//               label="Address" 
//               name="address" 
//               icon={Building2} 
//               value={formData.address} 
//               onChange={handleChange} 
              
//               placeholder="Street, City" 
//             />
//               {errors.address && (
//                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
//                 )}
            
//             <Field 
//               label="Date of Birth" 
//               name="dateOfBirth" 
//               icon={Calendar} 
//               type="date" 
//               value={formData.dateOfBirth} 
//               onChange={handleChange} 
              
//             />
//             {errors.dateOfBirth && (
//                <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
//                 )}
//             <Field 
//               label="Department" 
//               name="department" 
//               icon={Building2} 
//               value={formData.department} 
//               onChange={handleChange} 
             
//               options={DEPARTMENTS} 
//             />
//             {errors.department && (
//                <p className="text-red-500 text-xs mt-1">{errors.department}</p>
//                 )}
//             <Field 
//               label="Position" 
//               name="position" 
//               icon={BriefcaseBusiness} 
//               value={formData.position} 
//               onChange={handleChange} 
              
//               options={POSITIONS} 
//             />
//             {errors.position && (
//                <p className="text-red-500 text-xs mt-1">{errors.position}</p>
//                 )}
//             <Field 
//               label="Experience (Years)" 
//               name="experience" 
//               icon={BadgeCheck} 
//               type="number" 
//               value={formData.experience} 
//               onChange={handleChange} 
             
//               placeholder="0" 
//             />
//              {errors.position && (
//                <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
//                 )}
//             <Field 
//               label="Education" 
//               name="education" 
//               icon={GraduationCap} 
//               value={formData.education} 
//               onChange={handleChange} 
              
//               options={EDUCATION} 
//             />
//             {errors.education && (
//                <p className="text-red-500 text-xs mt-1">{errors.education}</p>
//                 )}
//           </div>

//           <button 
//             type="submit" 
//             disabled={submitting} 
//             className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-3 font-semibold shadow-md hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             {submitting ? (
//               <>
//                 <Loader2 className="h-5 w-5 animate-spin" />
//                 <span>Creating Account...</span>
//               </>
//             ) : (
//               "Create Account"
//             )}
//           </button>

//           <p className="text-sm text-gray-500 text-center">
//             Already have an account?{" "}
//             <Link to="/login" className="text-blue-600 font-medium hover:underline">
//               Login here
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;
import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  User,
  Mail,
  Lock,
  Phone as PhoneIcon,
  Calendar,
  Building2,
  BriefcaseBusiness,
  GraduationCap,
  BadgeCheck,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "../../util/axiosInstance.js";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// Options
const DEPARTMENTS = ["HR", "IT", "Finance", "Marketing", "Sales"] as const;
const POSITIONS = ["Manager", "Team Lead", "Developer", "Designer", "Intern", "HR"] as const;
const EDUCATION = ["Matric", "Intermediate", "Bachelor", "Master", "MPhil", "PhD", "Other"] as const;

// Form data type
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  department: string;
  position: string;
  experience: string;
  education: string;
  imagePreview: string | null;
  imageFile: File | null;
}

// Form errors type
type FormErrors = Partial<Record<keyof FormData, string>>;

// Initial form
const initialForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  dateOfBirth: "",
  department: "",
  position: "",
  experience: "",
  education: "",
  imagePreview: null,
  imageFile: null,
};

// Field component
interface FieldProps {
  label: string;
  name: keyof FormData;
  icon?: React.ElementType;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  options?: readonly string[];
  placeholder?: string;
  children?: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({
  label,
  name,
  icon: Icon,
  type = "text",
  value,
  onChange,
  error,
  options,
  placeholder,
  children,
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</label>
    <div className={`relative flex items-center rounded-xl border bg-white focus-within:ring-2 focus-within:ring-indigo-500 shadow-sm ${error ? "border-red-500" : "border-gray-300"}`}>
      {Icon && <Icon className="absolute left-3 h-5 w-5 text-gray-400" />}
      {options ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl bg-transparent pl-10 pr-3 py-2 outline-none text-gray-900"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : children ? (
        children
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl bg-transparent pl-10 pr-3 py-2 outline-none text-gray-900 placeholder:text-gray-400"
        />
      )}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors(prev => ({ ...prev, imageFile: "Please select a valid image file" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imageFile: "Image size should be less than 5MB" }));
        return;
      }
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = () => setFormData(prev => ({ ...prev, imagePreview: reader.result as string }));
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, imageFile: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "imagePreview" && key !== "imageFile") form.append(key, value as string);
      });
      if (formData.imageFile) form.append("image", formData.imageFile);

      const { data } = await axios.post("/api/users/signup", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success || data.user) {
        toast.success(data.message || "Registration successful! Please wait for admin approval.");
        setFormData(initialForm);
        setErrors({});
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err: any) {
      const resData = err?.response?.data?.message;
      const fieldErrors: FormErrors = {};

      if (resData?.errors?.length) {
        resData.errors.forEach((e: any) => {
          if (e.field) fieldErrors[e.field] = e.message;
        });
      } else if (resData?.message) {
        fieldErrors.email = resData.message;
      } else {
        toast.error(err?.response?.data?.message || err.message);
      }

      setErrors(fieldErrors);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 px-4">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-4xl my-8 bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
          <p className="text-sm text-gray-500 mt-2">Fill in the details below to get started</p>
        </div>

        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28 group">
            {formData.imagePreview ? (
              <img src={formData.imagePreview} alt="profile preview" className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 shadow-md" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 border-4 border-gray-300 shadow-md">
                <User className="w-12 h-12" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">Change</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
              title="Upload profile picture"
            />
          </div>
          {errors.imageFile && <p className="text-xs text-red-600 mt-2">{errors.imageFile}</p>}
          <p className="text-sm text-gray-500 mt-2">Upload Profile Picture (Optional)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="First Name" name="firstName" icon={User} value={formData.firstName} onChange={handleChange} placeholder="Usman" error={errors.firstName} />
            <Field label="Last Name" name="lastName" icon={User} value={formData.lastName} onChange={handleChange} placeholder="Ali" error={errors.lastName} />
            <Field label="Email" name="email" icon={Mail} type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" error={errors.email} />
            <Field label="Password" name="password" icon={Lock} error={errors.password}>
              <div className="relative w-full">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-transparent pl-10 pr-10 py-2 outline-none text-gray-900 placeholder:text-gray-400"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-2 grid place-items-center px-2 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </Field>
            <Field label="Phone" name="phone" icon={PhoneIcon} value={formData.phone} onChange={handleChange} placeholder="03XX-XXXXXXX" error={errors.phone} />
            <Field label="Address" name="address" icon={Building2} value={formData.address} onChange={handleChange} placeholder="Street, City" error={errors.address} />
            <Field label="Date of Birth" name="dateOfBirth" icon={Calendar} type="date" value={formData.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} />
            <Field label="Department" name="department" icon={Building2} value={formData.department} onChange={handleChange} options={DEPARTMENTS} error={errors.department} />
            <Field label="Position" name="position" icon={BriefcaseBusiness} value={formData.position} onChange={handleChange} options={POSITIONS} error={errors.position} />
            <Field label="Experience (Years)" name="experience" icon={BadgeCheck} type="number" value={formData.experience} onChange={handleChange} placeholder="0" error={errors.experience} />
            <Field label="Education" name="education" icon={GraduationCap} value={formData.education} onChange={handleChange} options={EDUCATION} error={errors.education} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-3 font-semibold shadow-md hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-sm text-gray-500 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
