


// import React, { useEffect, useState } from "react";
// import axios from "../../util/axiosInstance";
// import toast from "react-hot-toast";
// import { FaUserCheck, FaUserClock, FaUserTimes } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// // ------------------------
// // TYPES
// // ------------------------

// interface Employee {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   department: string;
// }

// interface AttendanceRecord {
//   _id: string;
//   date: string;
//   status: string;
//   employeeId: Employee; // Not optional anymore
//   name?: string;
//   department?: string;
// }

// interface Summary {
//   present: number;
//   late: number;
//   "half-day": number;
//   absent: number;
// }

// // ------------------------
// // HELPER FUNCTIONS
// // ------------------------

// const toYYYYMMDD = (d: Date = new Date()): string =>
//   [
//     d.getFullYear(),
//     String(d.getMonth() + 1).padStart(2, "0"),
//     String(d.getDate()).padStart(2, "0"),
//   ].join("-");

// const toMMDDYYYY = (dateStr: string): string => {
//   const [y, m, d] = dateStr.split("-");
//   return `${m}-${d}-${y}`;
// };

// const normalizeStatus = (raw: string | null | undefined): string => {
//   if (!raw && raw !== "0") return "Absent";
//   const s = String(raw).toLowerCase();
//   if (s.includes("present")) return "Present";
//   if (s.includes("late")) return "Late";
//   if (s.includes("half")) return "Half-day";
//   if (s.includes("abs")) return "Absent";
//   return s.charAt(0).toUpperCase() + s.slice(1);
// };

// const mapStatusToApi = (label: string): string => {
//   const t = label.toLowerCase();
//   if (t === "half-day") return "half-day";
//   if (t === "present") return "present";
//   if (t === "late") return "late";
//   return "absent";
// };

// const recalcSummary = (list: AttendanceRecord[] = []): Summary => {
//   const counts: Summary = { present: 0, late: 0, "half-day": 0, absent: 0 };
//   list.forEach((r) => {
//     const s = r.status.toLowerCase();
//     if (s.includes("present")) counts.present++;
//     else if (s.includes("late")) counts.late++;
//     else if (s.includes("half")) counts["half-day"]++;
//     else counts.absent++;
//   });
//   return counts;
// };

// // ------------------------
// // COMPONENT
// // ------------------------

// const Attendance: React.FC = () => {
//   const navigate = useNavigate();

//   const [selectedDate, setSelectedDate] = useState<string>(toYYYYMMDD());
//   const [summary, setSummary] = useState<Summary>({
//     present: 0,
//     late: 0,
//     "half-day": 0,
//     absent: 0,
//   });

//   const [employees, setEmployees] = useState<AttendanceRecord[]>([]);
//   const [filteredEmployees, setFilteredEmployees] = useState<AttendanceRecord[]>([]);
//   const [search, setSearch] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [savingId, setSavingId] = useState<string | null>(null);

//   // ------------------------
//   // FETCH SUMMARY
//   // ------------------------
//   const fetchSummary = async (date: string) => {
//     try {
//       const apiDate = toMMDDYYYY(date);
//       const res = await axios.get(`/api/attendance/summary/daily?date=${apiDate}`);

//       const data = res.data?.data?.summary;
//       setSummary(data || { present: 0, late: 0, "half-day": 0, absent: 0 });
//     } catch (err: any) {
//       console.error("fetchSummary error:", err);
//       toast.error(err?.response?.data?.message || "Unable to fetch summary");
//       setSummary({ present: 0, late: 0, "half-day": 0, absent: 0 });
//     }
//   };

//   // ------------------------
//   // FETCH EMPLOYEES
//   // ------------------------
//   const fetchEmployees = async (date: string) => {
//     setLoading(true);
//     try {
//       const res = await axios.get("/api/attendance/getAttendance");

//       const records: AttendanceRecord[] = res.data?.data?.records || [];

//       const filtered = records.filter((rec) => {
//         if (!rec.date) return false;
//         try {
//           const dt = new Date(rec.date);
//           return toYYYYMMDD(dt) === date;
//         } catch {
//           return false;
//         }
//       });

//       const normalized = filtered.map((rec) => {
//         const emp: Employee | null = rec.employeeId ?? null;
      
//         return {
//           ...rec,
//           name: emp ? `${emp.firstName} ${emp.lastName}` : "Unknown",
//           department: emp?.department ?? "-",
//           status: normalizeStatus(rec.status),
//         };
//       });
      

//       setEmployees(normalized);
//       setFilteredEmployees(normalized);
//       setSummary(recalcSummary(normalized));
//     } catch (err: any) {
//       console.error("fetchEmployees error:", err);
//       toast.error(err?.response?.data?.message || "Unable to fetch attendance");
//       setEmployees([]);
//       setFilteredEmployees([]);
//       setSummary({ present: 0, late: 0, "half-day": 0, absent: 0 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Run whenever date changes
//   useEffect(() => {
//     fetchEmployees(selectedDate);
//     fetchSummary(selectedDate);
//   }, [selectedDate]);

//   // ------------------------
//   // SEARCH FILTER
//   // ------------------------
//   useEffect(() => {
//     if (!search.trim()) {
//       setFilteredEmployees(employees);
//       return;
//     }
//     const q = search.toLowerCase();
//     setFilteredEmployees(
//       employees.filter(
//         (e) =>
//           e.name?.toLowerCase().includes(q) ||
//           e.employeeId?.email?.toLowerCase().includes(q) ||
//           e.department?.toLowerCase().includes(q)
//       )
//     );
//   }, [search, employees]);

//   // ------------------------
//   // SAVE HANDLER
//   // ------------------------
//   const handleSave = async (id: string, statusLabel: string) => {
//     try {
//       setSavingId(id);
//       const apiStatus = mapStatusToApi(statusLabel);

//       const res = await axios.put(`/api/attendance/${id}`, { status: apiStatus });

//       if (res.data?.success) {
//         toast.success("Attendance updated");

//         const updated = employees.map((r) =>
//           r._id === id ? { ...r, status: statusLabel } : r
//         );

//         setEmployees(updated);
//         setFilteredEmployees(updated);
//         setSummary(recalcSummary(updated));
//       } else {
//         toast.error("Failed to update");
//       }
//     } catch (err: any) {
//       console.error("handleSave error:", err);
//       toast.error(err?.response?.data?.message || "Error updating attendance");
//     } finally {
//       setSavingId(null);
//     }
//   };

//   // ------------------------
//   // UI
//   // ------------------------
//   return (
//         <div className="p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Daily Attendance</h2>
//           <p className="text-sm text-gray-500">Select date to view/update attendance</p>
//         </div>

//         <div className="flex items-center gap-3">
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring focus:ring-blue-300"
//           />
//         </div>
//       </div>

//       {/* Loading */}
//       {loading && <p className="text-gray-500 mb-4">Loading attendance...</p>}

//       {/* Summary cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {[
//           { title: "Present", value: summary.present ?? 0, gradient: "from-emerald-500 to-emerald-600", icon: <FaUserCheck size={26} /> },
//           { title: "Late", value: summary.late ?? 0, gradient: "from-amber-400 to-amber-500", icon: <FaUserClock size={26} /> },
//           { title: "Half-day", value: summary["half-day"] ?? 0, gradient: "from-indigo-500 to-indigo-600", icon: <FaUserClock size={26} /> },
//           { title: "Absent", value: summary.absent ?? 0, gradient: "from-rose-500 to-rose-600", icon: <FaUserTimes size={26} /> },
//         ].map((c, i) => (
//           <div key={i} className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
//             <div className={`p-3 rounded-lg bg-gradient-to-br ${c.gradient} text-white`}>{c.icon}</div>
//             <div>
//               <div className="text-sm text-gray-500">{c.title}</div>
//               <div className="text-2xl font-extrabold">{c.value}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Search bar */}
//       <div className="flex items-center gap-3 mb-4">
//         <input
//           placeholder="Search by name / email / department..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="flex-1 border rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-blue-200"
//         />
//       </div>

//       {/* Employees table */}
//       <div className="bg-white rounded-2xl shadow overflow-auto">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
//             <tr>
//               <th className="px-4 py-3 text-left">#</th>
//               <th className="px-4 py-3 text-left">Name</th>
//               <th className="px-4 py-3 text-left">Email</th>
//               <th className="px-4 py-3 text-left">Department</th>
//               <th className="px-4 py-3 text-left">Status</th>
//               <th className="px-4 py-3 text-center">Action</th>
//             </tr>
//           </thead>

//           <tbody className="text-gray-700 divide-y">
//             {filteredEmployees.length === 0 ? (
//               <tr>
//                 <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
//                   {loading ? "Loading..." : `No records found for ${selectedDate}`}
//                 </td>
//               </tr>
//             ) : (
//               filteredEmployees.map((r, idx) => (
//                 <tr key={r._id} className="hover:bg-gray-50">
//                   <td className="px-4 py-3">{idx + 1}</td>
//                   <td className="px-4 py-3 font-medium">{r.name}</td>
//                   <td className="px-4 py-3">{r.employeeId?.email || "-"}</td>
//                   <td className="px-4 py-3">{r.department || "-"}</td>
//                   <td className="px-4 py-3">
//                     <select
//                       value={r.status}
//                       onChange={(e) => {
//                         const newStatus = e.target.value;
//                         // Update local state optimistically
//                         setEmployees((prev) => prev.map((el) => (el._id === r._id ? { ...el, status: newStatus } : el)));
//                         setFilteredEmployees((prev) => prev.map((el) => (el._id === r._id ? { ...el, status: newStatus } : el)));
                        
//                         // Update summary instantly
//                         const updatedList = filteredEmployees.map((el) => (el._id === r._id ? { ...el, status: newStatus } : el));
//                         setSummary(recalcSummary(updatedList));
//                       }}
//                       className="border rounded px-2 py-1"
//                     >
//                       <option>Present</option>
//                       <option>Late</option>
//                       <option>Half-day</option>
//                       <option>Absent</option>
//                     </select>
//                   </td>
//                   <td className="px-4 py-3 text-center">
//                     <button
//                       onClick={() => handleSave(r._id, r.status)}
//                       disabled={savingId === r._id}
//                       className={`px-3 py-1 rounded text-white ${savingId === r._id ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
//                     >
//                       {savingId === r._id ? "Saving..." : "Save"}
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Attendance;
import React, { useEffect, useState } from "react";
import axios from "../../util/axiosInstance";
import toast from "react-hot-toast";
import { FaUserCheck, FaUserClock, FaUserTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// ------------------------
// TYPES
// ------------------------

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

interface AttendanceRecord {
  _id: string;
  date: string;
  status: string;
  employeeId: Employee;
  name?: string;
  department?: string;
}

interface Summary {
  present: number;
  late: number;
  "half-day": number;
  absent: number;
}

// ------------------------
// HELPER FUNCTIONS  (UNCHANGED)
// ------------------------

const toYYYYMMDD = (d: Date = new Date()): string =>
  [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");

const toMMDDYYYY = (dateStr: string): string => {
  const [y, m, d] = dateStr.split("-");
  return `${m}-${d}-${y}`;
};

const normalizeStatus = (raw: string | null | undefined): string => {
  if (!raw && raw !== "0") return "Absent";
  const s = String(raw).toLowerCase();
  if (s.includes("present")) return "Present";
  if (s.includes("late")) return "Late";
  if (s.includes("half")) return "Half-day";
  if (s.includes("abs")) return "Absent";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const mapStatusToApi = (label: string): string => {
  const t = label.toLowerCase();
  if (t === "half-day") return "half-day";
  if (t === "present") return "present";
  if (t === "late") return "late";
  return "absent";
};

const recalcSummary = (list: AttendanceRecord[] = []): Summary => {
  const counts: Summary = { present: 0, late: 0, "half-day": 0, absent: 0 };
  list.forEach((r) => {
    const s = r.status.toLowerCase();
    if (s.includes("present")) counts.present++;
    else if (s.includes("late")) counts.late++;
    else if (s.includes("half")) counts["half-day"]++;
    else counts.absent++;
  });
  return counts;
};

// ------------------------
// STATUS BADGE HELPER
// ------------------------

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    Present:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
    Late: "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
    "Half-day":
      "bg-indigo-50 text-indigo-700 border border-indigo-200 ring-1 ring-indigo-100",
    Absent: "bg-rose-50 text-rose-700 border border-rose-200 ring-1 ring-rose-100",
  };
  const dots: Record<string, string> = {
    Present: "bg-emerald-500",
    Late: "bg-amber-500",
    "Half-day": "bg-indigo-500",
    Absent: "bg-rose-500",
  };
  const cls = styles[status] || "bg-gray-50 text-gray-600 border border-gray-200";
  const dot = dots[status] || "bg-gray-400";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
};

// ------------------------
// AVATAR HELPER
// ------------------------

const Avatar: React.FC<{ name: string }> = ({ name }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const colors = [
    "bg-violet-100 text-violet-700",
    "bg-sky-100 text-sky-700",
    "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 ${color}`}
    >
      {initials}
    </span>
  );
};

// ------------------------
// MAIN COMPONENT
// ------------------------

const Attendance: React.FC = () => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<string>(toYYYYMMDD());
  const [summary, setSummary] = useState<Summary>({
    present: 0,
    late: 0,
    "half-day": 0,
    absent: 0,
  });

  const [employees, setEmployees] = useState<AttendanceRecord[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  // ------------------------
  // FETCH SUMMARY (UNCHANGED)
  // ------------------------
  const fetchSummary = async (date: string) => {
    try {
      const apiDate = toMMDDYYYY(date);
      const res = await axios.get(`/api/attendance/summary/daily?date=${apiDate}`);
      const data = res.data?.data?.summary;
      setSummary(data || { present: 0, late: 0, "half-day": 0, absent: 0 });
    } catch (err: any) {
      console.error("fetchSummary error:", err);
      toast.error(err?.response?.data?.message || "Unable to fetch summary");
      setSummary({ present: 0, late: 0, "half-day": 0, absent: 0 });
    }
  };

  // ------------------------
  // FETCH EMPLOYEES (UNCHANGED)
  // ------------------------
  const fetchEmployees = async (date: string) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/attendance/getAttendance");
      const records: AttendanceRecord[] = res.data?.data?.records || [];

      const filtered = records.filter((rec) => {
        if (!rec.date) return false;
        try {
          const dt = new Date(rec.date);
          return toYYYYMMDD(dt) === date;
        } catch {
          return false;
        }
      });

      const normalized = filtered.map((rec) => {
        const emp: Employee | null = rec.employeeId ?? null;
        return {
          ...rec,
          name: emp ? `${emp.firstName} ${emp.lastName}` : "Unknown",
          department: emp?.department ?? "-",
          status: normalizeStatus(rec.status),
        };
      });

      setEmployees(normalized);
      setFilteredEmployees(normalized);
      setSummary(recalcSummary(normalized));
    } catch (err: any) {
      console.error("fetchEmployees error:", err);
      toast.error(err?.response?.data?.message || "Unable to fetch attendance");
      setEmployees([]);
      setFilteredEmployees([]);
      setSummary({ present: 0, late: 0, "half-day": 0, absent: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(selectedDate);
    fetchSummary(selectedDate);
  }, [selectedDate]);

  // ------------------------
  // SEARCH FILTER (UNCHANGED)
  // ------------------------
  useEffect(() => {
    if (!search.trim()) {
      setFilteredEmployees(employees);
      return;
    }
    const q = search.toLowerCase();
    setFilteredEmployees(
      employees.filter(
        (e) =>
          e.name?.toLowerCase().includes(q) ||
          e.employeeId?.email?.toLowerCase().includes(q) ||
          e.department?.toLowerCase().includes(q)
      )
    );
  }, [search, employees]);

  // ------------------------
  // SAVE HANDLER (UNCHANGED)
  // ------------------------
  const handleSave = async (id: string, statusLabel: string) => {
    try {
      setSavingId(id);
      const apiStatus = mapStatusToApi(statusLabel);
      const res = await axios.put(`/api/attendance/${id}`, { status: apiStatus });

      if (res.data?.success) {
        toast.success("Attendance updated");
        const updated = employees.map((r) =>
          r._id === id ? { ...r, status: statusLabel } : r
        );
        setEmployees(updated);
        setFilteredEmployees(updated);
        setSummary(recalcSummary(updated));
      } else {
        toast.error("Failed to update");
      }
    } catch (err: any) {
      console.error("handleSave error:", err);
      toast.error(err?.response?.data?.message || "Error updating attendance");
    } finally {
      setSavingId(null);
    }
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
  const totalRecords = filteredEmployees.length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── Page wrapper ── */}
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-1 h-5 rounded-full bg-blue-600" />
              <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
                Human Resources
              </p>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Daily Attendance
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Monitor and update employee attendance records
            </p>
          </div>

          {/* Date picker */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg shadow-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: "Present",
              value: summary.present ?? 0,
              icon: <FaUserCheck size={18} />,
              accent: "text-emerald-600",
              iconBg: "bg-emerald-50",
              border: "border-emerald-100",
              bar: "bg-emerald-500",
            },
            {
              title: "Late",
              value: summary.late ?? 0,
              icon: <FaUserClock size={18} />,
              accent: "text-amber-600",
              iconBg: "bg-amber-50",
              border: "border-amber-100",
              bar: "bg-amber-500",
            },
            {
              title: "Half-day",
              value: summary["half-day"] ?? 0,
              icon: <FaUserClock size={18} />,
              accent: "text-indigo-600",
              iconBg: "bg-indigo-50",
              border: "border-indigo-100",
              bar: "bg-indigo-500",
            },
            {
              title: "Absent",
              value: summary.absent ?? 0,
              icon: <FaUserTimes size={18} />,
              accent: "text-rose-600",
              iconBg: "bg-rose-50",
              border: "border-rose-100",
              bar: "bg-rose-500",
            },
          ].map((c, i) => {
            const total =
              (summary.present || 0) +
              (summary.late || 0) +
              (summary["half-day"] || 0) +
              (summary.absent || 0);
            const pct = total > 0 ? Math.round((c.value / total) * 100) : 0;
            return (
              <div
                key={i}
                className={`bg-white rounded-xl border ${c.border} shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {c.title}
                  </span>
                  <span className={`p-2 rounded-lg ${c.iconBg} ${c.accent}`}>
                    {c.icon}
                  </span>
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                    {c.value}
                  </span>
                  <span className="ml-2 text-xs text-slate-400 font-medium">
                    {pct}%
                  </span>
                </div>
                {/* mini progress bar */}
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.bar} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Table toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-slate-800">
                Employee Records
              </h2>
              {!loading && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {totalRecords} {totalRecords === 1 ? "record" : "records"}
                </span>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                placeholder="Search name, email or department…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Loading bar */}
          {loading && (
            <div className="h-0.5 w-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse w-3/4 rounded-full" />
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["#", "Employee", "Email", "Department", "Status", "Action"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${
                          i === 5 ? "text-center" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <p className="text-sm font-medium text-slate-500">
                          {loading ? "Fetching records…" : `No records found for ${selectedDate}`}
                        </p>
                        {!loading && (
                          <p className="text-xs text-slate-400">
                            Try selecting a different date or clearing the search
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((r, idx) => (
                    <tr
                      key={r._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* # */}
                      <td className="px-5 py-3.5 text-xs text-slate-400 font-medium tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </td>

                      {/* Employee */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={r.name || "?"} />
                          <span className="font-semibold text-slate-800 whitespace-nowrap">
                            {r.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5 text-slate-500 text-xs">
                        {r.employeeId?.email || "—"}
                      </td>

                      {/* Department */}
                      <td className="px-5 py-3.5">
                        {r.department && r.department !== "-" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                            {r.department}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={r.status} />
                          <select
                            value={r.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              setEmployees((prev) =>
                                prev.map((el) =>
                                  el._id === r._id ? { ...el, status: newStatus } : el
                                )
                              );
                              setFilteredEmployees((prev) =>
                                prev.map((el) =>
                                  el._id === r._id ? { ...el, status: newStatus } : el
                                )
                              );
                              const updatedList = filteredEmployees.map((el) =>
                                el._id === r._id ? { ...el, status: newStatus } : el
                              );
                              setSummary(recalcSummary(updatedList));
                            }}
                            className="text-xs border border-slate-200 bg-white rounded-md px-2 py-1.5 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                          >
                            <option>Present</option>
                            <option>Late</option>
                            <option>Half-day</option>
                            <option>Absent</option>
                          </select>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => handleSave(r._id, r.status)}
                          disabled={savingId === r._id}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                            savingId === r._id
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white hover:shadow-md"
                          }`}
                        >
                          {savingId === r._id ? (
                            <>
                              <svg
                                className="animate-spin w-3 h-3"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8H4z"
                                />
                              </svg>
                              Saving
                            </>
                          ) : (
                            <>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Save
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          {filteredEmployees.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Showing{" "}
                <span className="font-medium text-slate-600">
                  {filteredEmployees.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-600">
                  {employees.length}
                </span>{" "}
                records
              </p>
              <p className="text-xs text-slate-400">
                Date:{" "}
                <span className="font-medium text-slate-600">{selectedDate}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;