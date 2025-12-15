// import React, { useState } from "react";
// import axios from "../../util/axiosInstance";
// import { toast } from "react-hot-toast";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("api/users/forget-password", { email });
//       console.log(res)

//       toast.success(res.data.data.message || "Reset link sent to your email");
//       setEmail("");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
//         <h2 className="text-2xl font-bold text-gray-800 text-center">
//           Forgot Password
//         </h2>
//         <p className="text-gray-600 text-center mt-2 mb-6">
//           Enter your email and we will send you a password reset link.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="text-gray-700 text-sm font-medium">
//               Email Address
//             </label>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your email"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//           >
//             Send Reset Link
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "../../util/axiosInstance";
import { toast } from "react-hot-toast";

interface ForgotPasswordResponse {
  data: {
    message?: string;
  };
}

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // TypeScript will infer the type from the interface
      const res = await axios.post<ForgotPasswordResponse>("api/users/forget-password", { email });
      toast.success(res.data.data.message || "Reset link sent to your email");
      setEmail("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Forgot Password
        </h2>
        <p className="text-gray-600 text-center mt-2 mb-6">
          Enter your email and we will send you a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-700 text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={handleEmailChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
