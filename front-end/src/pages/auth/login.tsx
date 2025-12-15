// import React, { useContext, useState } from "react";
// import axios from "../../util/axiosInstance"
// import { UserInfoContext } from "../../context/contextApi";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const {setUser,setAccessToken} = useContext(UserInfoContext)
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

// const handleSubmit = async(e) => {
//   e.preventDefault();
//   try {
//     const response  = await axios.post("/api/users/login", { email, password });
   
//     console.log("token is",response.data.data?.token,"user role is ",response.data.data?.role);
//     setUser(response.data.data); // 👈 user save in context
//     setAccessToken(response.data.data?.token); 
//     localStorage.setItem("accessToken", response.data.data.token);

//     toast.success("Login successfully...");
    

//     // 👇 role-based navigation
//    if (response.data.data?.role === "HR") {
//   navigate("/hr/HRdashboard"); // 👈 same as App.jsx route
// } else {
//   navigate("/employee/dashboard");
// }


//   } catch (error) {
//     toast.error(error?.response?.data?.message || error.message);
//   }
// };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 ">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
//         {/* Icon */}
//         <div className="flex justify-center mb-4">
//           <div className="bg-blue-100 p-3 rounded-full">
//             <svg
//               className="w-8 h-8 text-blue-600"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M5.121 17.804A9.003 9.003 0 0112 15a9.003 9.003 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//               />
//             </svg>
//           </div>
//         </div>

//         {/* Title */}
//         <h2 className="text-2xl font-bold text-center text-gray-800">
//           Employee Management
//         </h2>
//         <p className="text-center text-gray-500 mb-6">
//           Sign in to your account
//         </p>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-gray-600 text-sm mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
//               placeholder="john.doe@company.com"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600 text-sm mb-1">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
//               placeholder="••••••••"
//               required
//             />
//           </div>

//           {/* Remember / Forgot */}
//           <div className="flex items-center justify-between text-sm">
//             <label className="flex items-center gap-2 text-gray-600">
//               <input type="checkbox" className="rounded" />
//               Remember me
//             </label>
//             {/* <a href="/forgot-password" className="text-blue-600 hover:underline">
//               Forgot password?
//             </a> */}
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Sign In
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="mt-6 text-center text-sm text-gray-600">
//           New employee?{" "}
//           <a href="/signup" className="text-blue-600 hover:underline">
//             Create Account
//           </a>
//         </p>
//         <p className="mt-6 text-center text-sm text-gray-600">

//           <a href="/forget-password" className="text-red-600  text-md hover:underline">
//             Forget Password
//           </a>
//         </p>

//         {/* <p className="mt-4 text-center text-xs text-gray-400">
//           Credentials: DevRolin company <a href="/signup" className="text-blue-600 hover:underline">
//             Terms & Conditions
//           </a>
//         </p> */}
//       </div>
//     </div>
//   );
// };

// export default Login;

// src/pages/Login.tsx
import React, { useContext, useState, FormEvent, ChangeEvent } from "react";
import axios from "../../util/axiosInstance";
import { UserInfoContext } from "../../context/contextApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { setUser, setAccessToken } = useContext(UserInfoContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  // -----------------------------------
  // HANDLE SUBMIT
  // -----------------------------------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // API Response Type Definition
      interface LoginResponse {
        data: {
          token: string;
          role: string;
          [key: string]: any;
        };
        message?: string;
      }
      
      const response = await axios.post<LoginResponse>(
        "/api/users/login",
        { email, password }
      );
      
      const token = response.data.data.token;
      const role = response.data.data.role;
      

      console.log("token:", token, "role:", role);

      // Save in context
      setUser(response.data.data);
      setAccessToken(token);

      // Save token in localStorage
      localStorage.setItem("accessToken", token);

      toast.success("Login successfully!");

      // Role-based navigation
      if (role === "HR") {
        navigate("/hr/HRdashboard");
      } else {
        navigate("/employee/dashboard");
      }

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Employee Management
        </h2>
        <p className="text-center text-gray-500 mb-6">Sign in to your account</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="john.doe@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        {/* Forgot Password */}
        <p className="mt-6 text-center text-sm text-gray-600">
          <a href="/forget-password" className="text-red-600 hover:underline">
            Forget Password
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
