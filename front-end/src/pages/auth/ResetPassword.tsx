// import React, { useState } from "react";
// import axios from "../../util/axiosInstance";
// import { toast } from "react-hot-toast";
// import { useParams, useNavigate } from "react-router-dom";

// const ResetPassword = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   const [password, setPassword] = useState("");
//   const [confirmPass, setConfirmPass] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPass) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     try {
//       const res = await axios.post(`api/users/reset-password/${token}`, {
//         newPassword: password,
//       });

//       toast.success(res.data.message || "Password reset successfully");
//       navigate("/login");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to reset password");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
//         <h2 className="text-2xl font-bold text-gray-800 text-center">
//           Reset Password
//         </h2>
//         <p className="text-gray-600 text-center mt-2 mb-6">
//           Enter your new password below.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="text-gray-700 text-sm font-medium">
//               New Password
//             </label>
//             <input
//               type="password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter new password"
//             />
//           </div>

//           <div>
//             <label className="text-gray-700 text-sm font-medium">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               required
//               value={confirmPass}
//               onChange={(e) => setConfirmPass(e.target.value)}
//               className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Confirm new password"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "../../util/axiosInstance";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

interface ResetPasswordParams extends Record<string, string> {
  token?: string;
}


interface ResetPasswordResponse {
  message?: string;
}

const ResetPassword: React.FC = () => {
  const { token } = useParams<ResetPasswordParams>();
  const navigate = useNavigate();

  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPass) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    try {
      const res = await axios.post<ResetPasswordResponse>(`api/users/reset-password/${token}`, {
        newPassword: password,
      });

      toast.success(res.data.message || "Password reset successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmChange = (e: ChangeEvent<HTMLInputElement>) => setConfirmPass(e.target.value);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Reset Password</h2>
        <p className="text-gray-600 text-center mt-2 mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-700 text-sm font-medium">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={handlePasswordChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPass}
              onChange={handleConfirmChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
