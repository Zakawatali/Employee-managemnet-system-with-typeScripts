// import React, { useState, useEffect, useContext } from "react";
// import {
//   Menu,
//   X,
//   Home,
//   Users,
//   Calendar,
//   ClipboardList,
//   FileText,
//   BarChart2,
//   LogOut,
//   File,
//   User,
//   Trophy,
//   LineChart,
  
// } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";
// import { UserInfoContext } from "../context/contextApi";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { user } = useContext(UserInfoContext);
 
//   const [role, setRole] = useState(null);
//   const location = useLocation();

//   useEffect(() => {
//     setRole(user?.role);
//   }, [user]);

//   // Menus for different roles
//   const menus = {
//     admin: [
//       { name: "Dashboard", icon: Home, link: "/admin/dashboard" },
//       { name: "Employees", icon: Users, link: "/admin/employees" },
//       { name: "Attendance", icon: Calendar, link: "/admin/attendance" },
//       { name: "Leave Requests", icon: ClipboardList, link: "/admin/leave-requests" },
//       { name: "Tasks", icon: FileText, link: "/admin/tasks" },
//       { name: "Achievements", icon: Calendar, link: "/hr/achievements" },
//       { name: "Reports", icon: BarChart2, link: "/admin/reports" },
//       { name: "Logout", icon: LogOut, link: "/logout" },
//     ],
//     HR: [
//       { name: "Dashboard", icon: Home, link: "/hr/HRdashboard" },
//       { name: "Attendance", icon: Calendar, link: "/hr/attendance" },
//       { name: "Leave Requests", icon: ClipboardList, link: "/hr/leave-requests" },
//       { name: "Employee Approvals", icon: Calendar, link: "/hr/employee-approval" },
//       { name: "Employee", icon: Calendar, link: "/hr/employee" },
//       { name: "Letters", icon: Calendar, link: "/hr/letters" },
//      { name: "Achievements", icon: Calendar, link: "/hr/achievements" },
//       { name: "Tasks", icon: FileText, link: "/hr/tasks" },
//       { name: "Reports", icon: BarChart2, link: "/hr/Documents" },
//       { name: "Logout", icon: LogOut, link: "/logout" },
//     ],
//     Employee: [
//       { name: "Dashboard", icon: Home, link: "/employee/dashboard" },
//       { name: "Attendance", icon: Calendar, link: "/employee/attendance" },
//       { name: "Leave Requests", icon: ClipboardList, link: "/employee/leave-requests" },
//       { name: "My Tasks", icon: FileText, link: "/employee/tasks" },
//       { name: "Achievements", icon: Trophy, link: "/employee/achievement" },
//       { name: "Reports", icon:   LineChart, link: "/employee/document" },
//       { name: "Profile", icon: User, link: "/employee/profile" },
//       // { name: "Reports", icon: LineChart, link: "/employee/reports" },
//       { name: "Logout", icon: LogOut, link: "/logout" },
//     ],
//   };

//   const currentMenu = menus[role] || [];

//   return (
//     <>
//       {/* 🔹 Toggle Button fixed at top-left for small devices */}
//       <button
//         aria-label="Toggle Sidebar"
//         className="fixed top-4 left-4 z-50 p-2 text-white bg-blue-600 rounded-md md:hidden"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {isOpen ? <X size={24} /> : <Menu size={24} />}
//       </button>

//       {/* 🔹 Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r
//         transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
//         md:translate-x-0 transition-transform duration-300 z-40`}
//       >
//         <div className="p-4 text-lg font-bold text-blue-600 border-b capitalize">
//           {role ? `${role} Portal` : "Loading..."}
//         </div>

//         <ul className="space-y-1 p-4">
//           {currentMenu.map((item, index) => {
//             const Icon = item.icon;
//             // ✅ Fix: highlight if current path starts with link (handles /attendance/:empId too)
//             const isActive =
//               location.pathname === item.link ||
//               location.pathname.startsWith(item.link + "/");

//             return (
//               <li key={index}>
//                 <Link
//                   to={item.link}
//                   onClick={() => setIsOpen(false)} // close sidebar on mobile
//                   className={`flex items-center gap-3 p-2 rounded-lg transition
//                     ${
//                       isActive
//                         ? "bg-blue-100 text-blue-600 font-medium"
//                         : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//                     }`}
//                 >
//                   <Icon size={18} />
//                   <span>{item.name}</span>
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;
import React, { useState, useEffect, useContext } from "react";
import {
  Menu,
  X,
  Home,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  BarChart2,
  LogOut,
  File,
  User,
  Trophy,
  LineChart,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { UserInfoContext } from "../context/contextApi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(UserInfoContext);
  const [role, setRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setRole(user?.role);
  }, [user]);

  // MENUS (UNCHANGED)
  const menus = {
    admin: [
      { name: "Dashboard",      icon: Home,          link: "/admin/dashboard"     },
      { name: "Employees",      icon: Users,         link: "/admin/employees"     },
      { name: "Attendance",     icon: Calendar,      link: "/admin/attendance"    },
      { name: "Leave Requests", icon: ClipboardList, link: "/admin/leave-requests"},
      { name: "Tasks",          icon: FileText,      link: "/admin/tasks"         },
      { name: "Achievements",   icon: Calendar,      link: "/hr/achievements"     },
      { name: "Reports",        icon: BarChart2,     link: "/admin/reports"       },
      { name: "Logout",         icon: LogOut,        link: "/logout"              },
    ],
    HR: [
      { name: "Dashboard",          icon: Home,          link: "/hr/HRdashboard"       },
      { name: "Attendance",         icon: Calendar,      link: "/hr/attendance"        },
      { name: "Leave Requests",     icon: ClipboardList, link: "/hr/leave-requests"    },
      { name: "Employee Approvals", icon: Calendar,      link: "/hr/employee-approval" },
      { name: "Employee",           icon: Calendar,      link: "/hr/employee"          },
      { name: "Letters",            icon: Calendar,      link: "/hr/letters"           },
      { name: "Achievements",       icon: Calendar,      link: "/hr/achievements"      },
      { name: "Tasks",              icon: FileText,      link: "/hr/tasks"             },
      { name: "Reports",            icon: BarChart2,     link: "/hr/Documents"         },
      { name: "Logout",             icon: LogOut,        link: "/logout"               },
    ],
    Employee: [
      { name: "Dashboard",     icon: Home,          link: "/employee/dashboard"     },
      { name: "Attendance",    icon: Calendar,      link: "/employee/attendance"    },
      { name: "Leave Requests",icon: ClipboardList, link: "/employee/leave-requests"},
      { name: "My Tasks",      icon: FileText,      link: "/employee/tasks"         },
      { name: "Achievements",  icon: Trophy,        link: "/employee/achievement"   },
      { name: "Reports",       icon: LineChart,     link: "/employee/document"      },
      { name: "Profile",       icon: User,          link: "/employee/profile"       },
      { name: "Logout",        icon: LogOut,        link: "/logout"                 },
    ],
  };

  const currentMenu = menus[role] || [];

  // Separate logout from nav items for visual grouping
  const navItems    = currentMenu.filter((m) => m.name !== "Logout");
  const logoutItem  = currentMenu.find((m) => m.name === "Logout");

  // Role display helpers
  const roleLabel: Record<string, string> = {
    admin:    "Administrator",
    HR:       "HR Manager",
    Employee: "Employee",
  };

  const roleBadge: Record<string, string> = {
    admin:    "bg-rose-100 text-rose-700",
    HR:       "bg-violet-100 text-violet-700",
    Employee: "bg-emerald-100 text-emerald-700",
  };

  const avatarBg: Record<string, string> = {
    admin:    "bg-rose-600",
    HR:       "bg-violet-600",
    Employee: "bg-emerald-600",
  };

  const initials = role ? role.slice(0, 2).toUpperCase() : "—";

  return (
    <>
      {/* ── Mobile toggle ── */}
      <button
        aria-label="Toggle Sidebar"
        className="fixed top-4 left-4 z-50 p-2 text-white bg-blue-600 rounded-lg shadow-md md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ── Mobile backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 shadow-xl
          flex flex-col
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-300 z-40`}
      >
        {/* ── Brand / Logo ── */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-none">HR Portal</p>
            <p className="text-[10px] text-slate-400 mt-0.5 tracking-wide">Enterprise Suite</p>
          </div>
        </div>

        {/* ── Role Badge ── */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
            <div className={`w-8 h-8 rounded-lg ${avatarBg[role] || "bg-blue-600"} flex items-center justify-center shrink-0`}>
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : roleLabel[role] || "Loading…"}
              </p>
              <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 ${roleBadge[role] || "bg-slate-100 text-slate-500"}`}>
                {roleLabel[role] || role || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2 mb-2">
            Navigation
          </p>

          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.link ||
              location.pathname.startsWith(item.link + "/");

            return (
              <Link
                key={index}
                to={item.link}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`}>
                  <Icon size={16} />
                </span>
                <span className="truncate">{item.name}</span>

                {/* Active indicator dot */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Logout ── */}
        {logoutItem && (
          <div className="px-3 py-3 border-t border-slate-100">
            <Link
              to={logoutItem.link}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-150 group"
            >
              <span className="shrink-0"><LogOut size={16} /></span>
              <span>Logout</span>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;