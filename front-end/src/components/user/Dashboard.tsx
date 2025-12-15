// import React, { useEffect, useState, useContext } from "react";
// import axios from "../../util/axiosInstance";
// import { UserInfoContext } from "../../context/contextApi";
// import Layout from "../Layout";
// import {
//   Users,
//   ClipboardList,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { Loader2 } from "lucide-react";
// import { Link } from "react-router-dom";

// const HRDashboard = () => {
//   const { user } = useContext(UserInfoContext);
//   const [employees, setEmployees] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch employees
//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get("/api/employee/");
//       setEmployees(res.data.data?.employees || []);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || error.message);
//     }
//   };

//   // Fetch tasks
//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get("/api/task/allTasks");
//       setTasks(res.data.data || []);
//     } catch (error) {
//       toast.error(error?.response?.data?.data?.message || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//     fetchTasks();
//   }, []);

//   // Stats
//   const totalEmployees = employees.length;
//   const totalTasks = tasks.length;
//   const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
//   const pendingTasks = totalTasks - completedTasks;

//   const chartData = [
//     { name: "Completed", value: completedTasks },
//     { name: "Pending", value: pendingTasks },
//   ];

//   const COLORS = ["#22c55e", "#ef4444"];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <Loader2 className="animate-spin text-blue-600" size={40} />
//       </div>
//     );
//   }

//   return (
   
//       <div className="space-y-6 text-gray-800">
//         {/* Header */}
//         <div className="flex flex-col gap-1">
//           <h1 className="text-3xl font-bold text-gray-800">
//             Welcome,{" "}
//             <span className="text-blue-600">
//               {user?.name || "HR Manager"}
//             </span>
//           </h1>
//           <p className="text-gray-500">Here's an overview of HR activities</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[
//             {
//               title: "Total Employees",
//               value: totalEmployees,
//               icon: <Users size={28} />,
//               gradient: "from-blue-500 to-blue-600",
//             },
//             {
//               title: "Total Tasks",
//               value: totalTasks,
//               icon: <ClipboardList size={28} />,
//               gradient: "from-purple-500 to-purple-600",
//             },
//             {
//               title: "Completed Tasks",
//               value: completedTasks,
//               icon: <CheckCircle size={28} />,
//               gradient: "from-green-500 to-green-600",
//             },
//             {
//               title: "Pending Tasks",
//               value: pendingTasks,
//               icon: <AlertCircle size={28} />,
//               gradient: "from-red-500 to-red-600",
//             },
//           ].map((item, index) => (
//             <div
//               key={index}
//               className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-5 hover:shadow-xl transition group"
//             >
//               <div
//                 className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-md`}
//               >
//                 {item.icon}
//               </div>
//               <div>
//                 <p className="text-gray-500 text-sm font-medium">
//                   {item.title}
//                 </p>
//                 <p
//                   className={`text-2xl font-extrabold bg-gradient-to-r ${item.gradient} text-transparent bg-clip-text`}
//                 >
//                   {item.value}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Task Summary Chart */}
//         <div className="bg-white shadow-md rounded-xl p-6">
//           <h2 className="text-xl font-semibold mb-4 text-gray-800">
//             Task Status Overview
//           </h2>
//           {totalTasks === 0 ? (
//             <p className="text-gray-500">No tasks available</p>
//           ) : (
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={chartData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="value"
//                   label={({ name, value }) => `${name}: ${value}`}
//                 >
//                   {chartData.map((entry, index) => (
//                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend verticalAlign="bottom" />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* Employee Preview */}
//         <div className="bg-white shadow-lg rounded-2xl p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//               👥 Recent Employees
//             </h2>
//             <Link
//               to={"/hr/employee"}
//               className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
//             >
//               View All →
//             </Link>
//           </div>

//           {employees.length === 0 ? (
//             <p className="text-gray-500 text-center py-6">
//               No employees found
//             </p>
//           ) : (
//             <div>
//               <div className="hidden sm:grid grid-cols-3 text-sm font-semibold text-gray-600 border-b pb-2 mb-3">
//                 <span className="pl-4">Name</span>
//                 <span>Email</span>
//                 <span className="text-center">Role</span>
//               </div>

//               <div className="space-y-3">
//                 {employees.slice(0, 5).map((emp) => (
//                   <div
//                     key={emp._id}
//                     className="grid grid-cols-1 sm:grid-cols-3 items-center bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
//                         {emp.firstName.charAt(0)}
//                       </div>
//                       <span className="font-medium text-gray-800">
//                         {emp.firstName} {emp.lastName}
//                       </span>
//                     </div>
//                     <span className="text-sm text-gray-600 break-all">
//                       {emp.email}
//                     </span>
//                     <div className="flex sm:justify-center mt-2 sm:mt-0">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
//                           emp.role === "ADMIN"
//                             ? "bg-red-100 text-red-700"
//                             : emp.role === "HR"
//                             ? "bg-blue-100 text-blue-700"
//                             : "bg-green-100 text-green-700"
//                         }`}
//                       >
//                         {emp.role || "Employee"}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
   
//   );
// };

// export default HRDashboard;
import React, { useEffect, useState, useContext } from "react";
import axios from "../../util/axiosInstance";
import { UserInfoContext } from "../../context/contextApi";
import Layout from "../Layout";
import { Users, ClipboardList, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

// Types
interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: "ADMIN" | "HR" | "EMPLOYEE" | string;
}

interface Task {
  _id: string;
  title: string;
  status: "COMPLETED" | "PENDING" | string;
  assignedTo?: Employee;
}

interface User {
  name?: string;
}

const HRDashboard: React.FC = () => {
  const { user } = useContext<{ user?: User }>(UserInfoContext);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/api/employee/");
      setEmployees(res.data.data?.employees || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/task/allTasks");
      setTasks(res.data.data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  // Stats
  const totalEmployees = employees.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const pendingTasks = totalTasks - completedTasks;

  const chartData = [
    { name: "Completed", value: completedTasks },
    { name: "Pending", value: pendingTasks },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-800">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome,{" "}
          <span className="text-blue-600">{user?.name || "HR Manager"}</span>
        </h1>
        <p className="text-gray-500">Here's an overview of HR activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Employees",
            value: totalEmployees,
            icon: <Users size={28} />,
            gradient: "from-blue-500 to-blue-600",
          },
          {
            title: "Total Tasks",
            value: totalTasks,
            icon: <ClipboardList size={28} />,
            gradient: "from-purple-500 to-purple-600",
          },
          {
            title: "Completed Tasks",
            value: completedTasks,
            icon: <CheckCircle size={28} />,
            gradient: "from-green-500 to-green-600",
          },
          {
            title: "Pending Tasks",
            value: pendingTasks,
            icon: <AlertCircle size={28} />,
            gradient: "from-red-500 to-red-600",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-5 hover:shadow-xl transition group"
          >
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-md`}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{item.title}</p>
              <p
                className={`text-2xl font-extrabold bg-gradient-to-r ${item.gradient} text-transparent bg-clip-text`}
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Task Summary Chart */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Task Status Overview
        </h2>
        {totalTasks === 0 ? (
          <p className="text-gray-500">No tasks available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Employee Preview */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            👥 Recent Employees
          </h2>
          <Link
            to={"/hr/employee"}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          >
            View All →
          </Link>
        </div>

        {employees.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No employees found</p>
        ) : (
          <div>
            <div className="hidden sm:grid grid-cols-3 text-sm font-semibold text-gray-600 border-b pb-2 mb-3">
              <span className="pl-4">Name</span>
              <span>Email</span>
              <span className="text-center">Role</span>
            </div>

            <div className="space-y-3">
              {employees.slice(0, 5).map((emp) => (
                <div
                  key={emp._id}
                  className="grid grid-cols-1 sm:grid-cols-3 items-center bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {emp.firstName.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-800">
                      {emp.firstName} {emp.lastName}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 break-all">{emp.email}</span>
                  <div className="flex sm:justify-center mt-2 sm:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                        emp.role === "ADMIN"
                          ? "bg-red-100 text-red-700"
                          : emp.role === "HR"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {emp.role || "Employee"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;
