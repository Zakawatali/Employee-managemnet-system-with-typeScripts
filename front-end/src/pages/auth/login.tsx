
import React, { useContext, useState, FormEvent, ChangeEvent } from "react";
import axios from "../../util/axiosInstance";
import { UserInfoContext } from "../../context/contextApi";
import toast from "react-hot-toast";



import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { setUser, setAccessToken } = useContext(UserInfoContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  

  const navigate = useNavigate();

  // -----------------------------------
  // HANDLE SUBMIT
  // -----------------------------------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

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
       console.log("the login response is;",response)
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
      } else if(role === "Employee") {
        navigate("/employee/dashboard");
      }
      else{
        navigate("/login");

      }

    } catch (err: any) {
      const data = err?.response?.data?.message;

      // ✅ Joi validation errors
      if (data?.errors?.length) {
        const fieldErrors: any = {};
    
        data.errors.forEach((e: any) => {
          if (e.field) {
            fieldErrors[e.field] = e.message;
          }
        });
    
        setErrors(fieldErrors);
        return;
      } else {
        toast.error(
          err?.response?.data ||err?.response?.data?.message || err?.response?.data?.error || err.message
        );
      }
     
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
            {errors.email && (
               <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
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
            {errors.password && (
               <p className="text-red-500 text-xs mt-1">{errors.password}</p>
               )}
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
          <a href="/forget-password" className="text-green-600 hover:underline">
            Forget Password
          </a>
        </p>
        <p className="text-sm text-gray-500 text-center">
            Create new account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              Sign Up here
            </Link>
          </p>
      </div>
    </div>
  );
};

export default Login;
