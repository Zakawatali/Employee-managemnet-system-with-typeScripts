

// import React, { useEffect, useState, useContext } from "react";
// import axios from "../../util/axiosInstance";
// import { UserInfoContext } from "../../context/contextApi";
// import { Users, ClipboardList, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";

// // ------------------------
// // TYPES
// // ------------------------

// interface User {
//   name?: string;
// }

// interface Employee {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role?: "ADMIN" | "HR" | "EMPLOYEE" | string;
// }

// interface Task {
//   _id: string;
//   title: string;
//   status: string; // e.g., "COMPLETED" or "PENDING"
// }

// // ------------------------
// // COMPONENT
// // ------------------------

// const HRDashboard: React.FC = () => {
//   const { user } = useContext(UserInfoContext) as { user: User | null };

//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Fetch employees
//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get<{ success: boolean; data: { employees: Employee[] } }>("/api/employee/");
//       setEmployees(res.data.data?.employees || []);
//     } catch (error) {
//       const err = error as any;
//       toast.error(err?.response?.data?.message || err.message);
//     }
//   };

//   // Fetch tasks
//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get<{ success: boolean; data: { tasks: Task[]; page: number; total: number } }>("/api/task/allTasks");
// setTasks(res.data.data.tasks || []); // Make sure to assign the array, not the whole object

//     } catch (error) {
//       const err = error as  any;
//       toast.error(err?.response?.data?.message || err.message);
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
//     <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
//       {/* Main Content */}
//       <div className="flex-1 p-4 md:p-8 mt-12 md:mt-0">
//         <div className="space-y-6 text-gray-800">
//           {/* Header */}
//           <div className="flex flex-col gap-1">
//             <h1 className="text-3xl font-bold text-gray-800">
//               Welcome,{" "}
//               <span className="text-blue-600">
//                 {user?.name || "HR Manager"}
//               </span>
//             </h1>
//             <p className="text-gray-500">Here's an overview of HR activities</p>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               {
//                 title: "Total Employees",
//                 value: totalEmployees,
//                 icon: <Users size={28} />,
//                 gradient: "from-blue-500 to-blue-600",
//               },
//               {
//                 title: "Total Tasks",
//                 value: totalTasks,
//                 icon: <ClipboardList size={28} />,
//                 gradient: "from-purple-500 to-purple-600",
//               },
//               {
//                 title: "Completed Tasks",
//                 value: completedTasks,
//                 icon: <CheckCircle size={28} />,
//                 gradient: "from-green-500 to-green-600",
//               },
//               {
//                 title: "Pending Tasks",
//                 value: pendingTasks,
//                 icon: <AlertCircle size={28} />,
//                 gradient: "from-red-500 to-red-600",
//               },
//             ].map((item, index) => (
//               <div
//                 key={index}
//                 className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-5 hover:shadow-xl transition group"
//               >
//                 <div
//                   className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-md`}
//                 >
//                   {item.icon}
//                 </div>
//                 <div>
//                   <p className="text-gray-500 text-sm font-medium">
//                     {item.title}
//                   </p>
//                   <p
//                     className={`text-2xl font-extrabold bg-gradient-to-r ${item.gradient} text-transparent bg-clip-text`}
//                   >
//                     {item.value}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Task Summary Chart */}
//           <div className="bg-white shadow-md rounded-xl p-6">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">
//               Task Status Overview
//             </h2>
//             {totalTasks === 0 ? (
//               <p className="text-gray-500">No tasks available</p>
//             ) : (
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={chartData}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     dataKey="value"
//                     label={({ name, value }) => `${name}: ${value}`}
//                   >
//                     {chartData.map((entry, index) => (
//                       <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend verticalAlign="bottom" />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}
//           </div>

//           {/* Employee Preview */}
//           <div className="bg-white shadow-lg rounded-2xl p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//                 👥 Recent Employees
//               </h2>
//               <Link
//                 to={"/hr/employee"}
//                 className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
//               >
//                 View All →
//               </Link>
//             </div>

//             {employees.length === 0 ? (
//               <p className="text-gray-500 text-center py-6">
//                 No employees found
//               </p>
//             ) : (
//               <div>
//                 <div className="hidden sm:grid grid-cols-3 text-sm font-semibold text-gray-600 border-b pb-2 mb-3">
//                   <span className="pl-4">Name</span>
//                   <span>Email</span>
//                   <span className="text-center">Role</span>
//                 </div>

//                 <div className="space-y-3">
//                   {employees.slice(0, 5).map((emp) => (
//                     <div
//                       key={emp._id}
//                       className="grid grid-cols-1 sm:grid-cols-3 items-center bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
//                           {emp.firstName.charAt(0)}
//                         </div>
//                         <span className="font-medium text-gray-800">
//                           {emp.firstName} {emp.lastName}
//                         </span>
//                       </div>
//                       <span className="text-sm text-gray-600 break-all">
//                         {emp.email}
//                       </span>
//                       <div className="flex sm:justify-center mt-2 sm:mt-0">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
//                             emp.role === "ADMIN"
//                               ? "bg-red-100 text-red-700"
//                               : emp.role === "HR"
//                               ? "bg-blue-100 text-blue-700"
//                               : "bg-green-100 text-green-700"
//                           }`}
//                         >
//                           {emp.role || "Employee"}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HRDashboard;
import React, { useEffect, useState, useContext } from "react";
import axios from "../../util/axiosInstance";
import { UserInfoContext } from "../../context/contextApi";
import { Users, ClipboardList, CheckCircle, AlertCircle, Loader2, ArrowUpRight } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// ------------------------
// TYPES
// ------------------------
interface User {
  name?: string;
}

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
  status: string;
}

// ------------------------
// DESIGN TOKENS
// ------------------------
const roleConfig: Record<string, { bg: string; text: string; border: string }> = {
  ADMIN:    { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200"     },
  HR:       { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200"     },
  EMPLOYEE: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
};

const avatarGradients = [
  "from-violet-500 to-indigo-600",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-500",
];
const getGradient = (name: string) =>
  avatarGradients[name.charCodeAt(0) % avatarGradients.length];

// Custom recharts tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl px-4 py-2.5 text-center">
        <p className="text-xs text-slate-400 font-medium mb-0.5">{payload[0].name}</p>
        <p className="text-2xl font-bold text-slate-800">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// ------------------------
// COMPONENT
// ------------------------
const HRDashboard: React.FC = () => {
  const { user } = useContext(UserInfoContext) as { user: User | null };

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks]         = useState<Task[]>([]);
  const [loading, setLoading]     = useState<boolean>(true);

  // ── ALL ORIGINAL LOGIC UNTOUCHED ─────────────────────────────────────────
  const fetchEmployees = async () => {
    try {
      const res = await axios.get<{ success: boolean; data: { employees: Employee[] } }>("/api/employee/");
      setEmployees(res.data.data?.employees || []);
    } catch (error) {
      const err = error as any;
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get<{ success: boolean; data: { tasks: Task[]; page: number; total: number } }>("/api/task/allTasks");
      setTasks(res.data.data.tasks || []);
    } catch (error) {
      const err = error as any;
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  const totalEmployees = employees.length;
  const totalTasks     = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const pendingTasks   = totalTasks - completedTasks;

  const chartData = [
    { name: "Completed", value: completedTasks },
    { name: "Pending",   value: pendingTasks   },
  ];

  const COLORS = ["#10b981", "#f59e0b"];
  // ─────────────────────────────────────────────────────────────────────────

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#f4f6f9] gap-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');`}</style>
        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
          <Loader2 size={22} className="text-white animate-spin" />
        </div>
        <p className="text-slate-400 text-sm font-medium">Loading dashboard...</p>
      </div>
    );
  }

  // ── Main ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4f6f9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        @keyframes fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .card-hover { transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .card-hover:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .row-hover:hover { background: #f8faff; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page Header ── */}
        <div className="mb-10 fade-up">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">Overview</p>
          <h1
            className="text-4xl font-bold text-slate-900 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Welcome back,{" "}
            <span className="text-blue-600">{user?.name || "HR Manager"}</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">Here's what's happening with your team today.</p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: "Total Employees",
              value: totalEmployees,
              icon: <Users size={20} />,
              accent: "text-blue-600",
              iconBg: "bg-blue-50",
              sub: "Active workforce",
              delay: "0ms",
            },
            {
              title: "Total Tasks",
              value: totalTasks,
              icon: <ClipboardList size={20} />,
              accent: "text-violet-600",
              iconBg: "bg-violet-50",
              sub: "Across all teams",
              delay: "60ms",
            },
            {
              title: "Completed",
              value: completedTasks,
              icon: <CheckCircle size={20} />,
              accent: "text-emerald-600",
              iconBg: "bg-emerald-50",
              sub: `${completionRate}% completion rate`,
              delay: "120ms",
            },
            {
              title: "Pending Tasks",
              value: pendingTasks,
              icon: <AlertCircle size={20} />,
              accent: "text-amber-600",
              iconBg: "bg-amber-50",
              sub: "Requires attention",
              delay: "180ms",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 fade-up card-hover"
              style={{ animationDelay: card.delay }}
            >
              <div className="mb-4">
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} ${card.accent} flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 leading-none mb-1">{card.value}</p>
              <p className="text-sm font-semibold text-slate-700">{card.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Chart + Employee List ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Pie Chart Card */}
          <div
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
                <ClipboardList size={15} className="text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800 text-sm">Task Overview</h2>
                <p className="text-xs text-slate-400">Completion breakdown</p>
              </div>
            </div>

            {totalTasks === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <ClipboardList size={22} className="text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm">No tasks available</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span style={{ color: "#64748b", fontSize: "12px", fontWeight: 500 }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Progress bar */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-slate-500 font-medium">Completion Rate</span>
                    <span className="text-xs font-bold text-slate-800">{completionRate}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Recent Employees Card */}
          <div
            className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden fade-up"
            style={{ animationDelay: "300ms" }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <Users size={15} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 text-sm">Recent Employees</h2>
                  <p className="text-xs text-slate-400">
                    Showing {Math.min(employees.length, 5)} of {totalEmployees}
                  </p>
                </div>
              </div>
              <Link
                to="/hr/employee"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition px-3 py-1.5 rounded-lg hover:bg-blue-50"
              >
                View All <ArrowUpRight size={12} />
              </Link>
            </div>

            {/* List */}
            {employees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <Users size={22} className="text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm">No employees found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {employees.slice(0, 5).map((emp, i) => {
                  const gradient = getGradient(emp.firstName);
                  const rc       = roleConfig[emp.role ?? "EMPLOYEE"] || roleConfig.EMPLOYEE;
                  return (
                    <div
                      key={emp._id}
                      className="flex items-center gap-4 px-6 py-3.5 row-hover transition-colors"
                      style={{ animation: "fadeUp 0.35s ease both", animationDelay: `${320 + i * 55}ms` }}
                    >
                      {/* Avatar with gradient initials */}
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                      >
                        {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                      </div>

                      {/* Name + Email */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate leading-snug">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{emp.email}</p>
                      </div>

                      {/* Role badge */}
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-semibold flex-shrink-0 ${rc.bg} ${rc.text} ${rc.border}`}
                      >
                        {emp.role || "EMPLOYEE"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HRDashboard;