

// import React, { useContext, useEffect, useState } from "react";
// import axios from "../../util/axiosInstance";
// import { Calendar, Clock } from "lucide-react";
// import { UserInfoContext } from "../../context/contextApi";
// import toast from "react-hot-toast";

// // ✅ Types
// interface User {
//   _id?: string;
//   name?: string;
// }

// interface AttendanceRecord {
//   date: string; // ISO string
//   status: "present" | "late" | "half-day" | "absent" | string;
//   checkIn: string | null;
//   checkOut: string | null;
// }

// interface Stats {
//   present: number;
//   late: number;
//   halfDay: number;
//   absent: number;
//   attendanceRate: number;
// }

// const Attendance: React.FC = () => {
//   const { user } = useContext<{ user?: User }>(UserInfoContext);

//   const [status, setStatus] = useState<string>("Not checked in");
//   const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
//   const [stats, setStats] = useState<Stats>({
//     present: 0,
//     late: 0,
//     halfDay: 0,
//     absent: 0,
//     attendanceRate: 0,
//   });

//   const [recent, setRecent] = useState<AttendanceRecord[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const today = new Date();
//   const [month, setMonth] = useState<number>(today.getMonth() + 1);
//   const [year, setYear] = useState<number>(today.getFullYear());

//   // ✅ Fetch Attendance
//   const fetchAttendance = async (preserveClockState = false) => {
//     if (!user?._id) return;

//     try {
//       setLoading(true);
//       const res = await axios.get(`/api/attendance/${user._id}`);
//       const records: AttendanceRecord[] = res?.data?.records || [];

//       // Filter by selected month/year
//       const filtered = records.filter((r) => {
//         const d = new Date(r.date);
//         return d.getMonth() + 1 === month && d.getFullYear() === year;
//       });

//       // Generate full list of days for current month
//       const daysInMonth = new Date(year, month, 0).getDate();
//       const todayDate = new Date();

//       const allDays: AttendanceRecord[] = [];
//       for (let day = 1; day <= daysInMonth; day++) {
//         const date = new Date(year, month - 1, day);
//         const dateStr = date.toISOString().split("T")[0];

//         const record = filtered.find(
//           (r) => new Date(r.date).toISOString().split("T")[0] === dateStr
//         );

//         if (!record && date <= todayDate) {
//           allDays.push({
//             date: dateStr,
//             status: "absent",
//             checkIn: null,
//             checkOut: null,
//           });
//         } else if (record) {
//           allDays.push(record);
//         }
//       }

//       setRecent(allDays);

//       // Count statuses
//       const present = allDays.filter((r) => r.status === "present").length;
//       const late = allDays.filter((r) => r.status === "late").length;
//       const halfDay = allDays.filter((r) => r.status === "half-day").length;
//       const absent = allDays.filter((r) => r.status === "absent").length;

//       const totalDays = present + late + halfDay + absent;
//       const attendanceRate =
//         totalDays > 0 ? ((present + late + halfDay) / totalDays) * 100 : 0;

//       setStats({ present, late, halfDay, absent, attendanceRate });

//       // Update today's clock state
//       if (!preserveClockState) {
//         const todayISO = new Date().toISOString().split("T")[0];
//         const todayRecord = allDays.find(
//           (r) => new Date(r.date).toISOString().split("T")[0] === todayISO
//         );

//         if (todayRecord) {
//           setStatus(todayRecord.status);
//           setIsClockedIn(!!todayRecord.checkIn && !todayRecord.checkOut);
//         } else {
//           setStatus("Not checked in");
//           setIsClockedIn(false);
//         }
//       }
//     } catch (err: any) {
//       console.error("Error fetching attendance", err);
//       toast.error(err?.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//   }, [user, month, year]);

//   const handleClock = async () => {
//     if (!user?._id) return;
//     try {
//       let res;

//       if (isClockedIn) {
//         res = await axios.post(`/api/attendance/checkout/${user._id}`);
//         toast.success(res?.data?.message || "Checked out successfully");
//         setIsClockedIn(false);
//         setStatus("Not checked in");
//         fetchAttendance(true);
//       } else {
//         res = await axios.post(`/api/attendance/checkin/${user._id}`);
//         toast.success(res?.data?.message || "Checked in successfully");
//         setIsClockedIn(true);
//         setStatus("present");

//         setTimeout(() => fetchAttendance(true), 2000);
//       }
//     } catch (err: any) {
//       console.error("Check In/Out failed", err);
//       const msg = err?.response?.data?.message;

//       if (msg?.includes("Already checked in")) {
//         toast.error(msg);
//         setIsClockedIn(true);
//         setStatus("present");
//       } else {
//         toast.error(msg || err?.message || "Something went wrong");
//       }
//     }
//   };

//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const years = Array.from({ length: 6 }, (_, i) => today.getFullYear() - 2 + i);

//   return (
//     <div className="p-6 space-y-8">
//       {/* Clock In/Out */}
//       <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-md flex items-center justify-between text-white">
//         <div>
//           <h3 className="text-lg font-semibold flex items-center gap-2">
//             <Clock className="w-5 h-5" /> Attendance Control
//           </h3>
//           <p className="text-sm opacity-80">Today’s Status</p>
//           <p className="text-xl font-bold mt-1">{status}</p>
//         </div>
//         <button
//           onClick={handleClock}
//           className={`px-6 py-2 rounded-lg font-medium shadow-md transition ${
//             isClockedIn
//               ? "bg-red-500 hover:bg-red-600"
//               : "bg-green-500 hover:bg-green-600"
//           }`}
//         >
//           {isClockedIn ? "Check Out" : "Check In"}
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//         <div className="bg-white p-5 rounded-xl shadow hover:shadow-md">
//           <p className="text-sm text-gray-500">Attendance Rate</p>
//           <p className="text-2xl font-bold text-indigo-600">
//             {stats.attendanceRate.toFixed(1)}%
//           </p>
//         </div>
//         <div className="bg-white p-5 rounded-xl shadow hover:shadow-md">
//           <p className="text-sm text-gray-500">Present</p>
//           <p className="text-2xl font-bold text-green-600">{stats.present}</p>
//         </div>
//         <div className="bg-white p-5 rounded-xl shadow hover:shadow-md">
//           <p className="text-sm text-gray-500">Late</p>
//           <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
//         </div>
//         <div className="bg-white p-5 rounded-xl shadow hover:shadow-md">
//           <p className="text-sm text-gray-500">Half-Day</p>
//           <p className="text-2xl font-bold text-blue-600">{stats.halfDay}</p>
//         </div>
//         <div className="bg-white p-5 rounded-xl shadow hover:shadow-md">
//           <p className="text-sm text-gray-500">Absent</p>
//           <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
//         </div>
//       </div>

//       {/* Calendar & Recent */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-2xl shadow-md">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold flex items-center gap-2 text-gray-700">
//               <Calendar className="w-5 h-5 text-indigo-500" /> Calendar View
//             </h3>
//             <div className="flex gap-2">
//               <select
//                 value={month}
//                 onChange={(e) => setMonth(Number(e.target.value))}
//                 className="border rounded-md px-3 py-1 text-sm"
//               >
//                 {months.map((m, i) => (
//                   <option key={i} value={i + 1}>
//                     {m}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 value={year}
//                 onChange={(e) => setYear(Number(e.target.value))}
//                 className="border rounded-md px-3 py-1 text-sm"
//               >
//                 {years.map((y) => (
//                   <option key={y} value={y}>
//                     {y}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <p className="text-sm text-gray-500 mb-3">
//             {months[month - 1]} {year}
//           </p>
//           <div className="flex flex-wrap gap-4 text-sm">
//             <span className="flex items-center gap-1">
//               <span className="w-3 h-3 rounded-full bg-green-500"></span> Present
//             </span>
//             <span className="flex items-center gap-1">
//               <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Late
//             </span>
//             <span className="flex items-center gap-1">
//               <span className="w-3 h-3 rounded-full bg-blue-500"></span> Half-Day
//             </span>
//             <span className="flex items-center gap-1">
//               <span className="w-3 h-3 rounded-full bg-red-500"></span> Absent
//             </span>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow-md">
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">
//             Recent Records
//           </h3>
//           {loading ? (
//             <p className="text-gray-500">Loading...</p>
//           ) : recent.length === 0 ? (
//             <p className="text-gray-400 text-sm">No records found</p>
//           ) : (
//             <ul className="space-y-2 text-sm">
//               {recent.map((r, i) => (
//                 <li
//                   key={i}
//                   className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-50"
//                 >
//                   <span>{new Date(r.date).toLocaleDateString()}</span>
//                   <span
//                     className={`font-semibold ${
//                       r.status === "present"
//                         ? "text-green-600"
//                         : r.status === "late"
//                         ? "text-yellow-600"
//                         : r.status === "half-day"
//                         ? "text-blue-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     {r.status}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Attendance;
import React, { useContext, useEffect, useState } from "react";
import axios from "../../util/axiosInstance";
import { Calendar, Clock } from "lucide-react";
import { UserInfoContext } from "../../context/contextApi";
import toast from "react-hot-toast";

// ✅ Types (UNCHANGED)
interface User {
  _id?: string;
  name?: string;
}

interface AttendanceRecord {
  date: string;
  status: "present" | "late" | "half-day" | "absent" | string;
  checkIn: string | null;
  checkOut: string | null;
}

interface Stats {
  present: number;
  late: number;
  halfDay: number;
  absent: number;
  attendanceRate: number;
}

// ------------------------
// STATUS CONFIG
// ------------------------
const statusConfig: Record<string, { dot: string; text: string; badge: string }> = {
  present:  { dot: "bg-emerald-500", text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  late:     { dot: "bg-amber-500",   text: "text-amber-600",   badge: "bg-amber-50 text-amber-700 border border-amber-200"     },
  "half-day":{ dot: "bg-sky-500",    text: "text-sky-600",     badge: "bg-sky-50 text-sky-700 border border-sky-200"           },
  absent:   { dot: "bg-rose-500",    text: "text-rose-600",    badge: "bg-rose-50 text-rose-700 border border-rose-200"        },
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg = statusConfig[status] || { dot: "bg-slate-400", text: "text-slate-500", badge: "bg-slate-50 text-slate-600 border border-slate-200" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

// ------------------------
// MAIN COMPONENT
// ------------------------
const Attendance: React.FC = () => {
  const { user } = useContext<{ user?: User }>(UserInfoContext);

  const [status, setStatus] = useState<string>("Not checked in");
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats>({ present: 0, late: 0, halfDay: 0, absent: 0, attendanceRate: 0 });
  const [recent, setRecent] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [year, setYear] = useState<number>(today.getFullYear());

  // ✅ ALL LOGIC UNCHANGED
  const fetchAttendance = async (preserveClockState = false) => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const res = await axios.get(`/api/attendance/${user._id}`);
      const records: AttendanceRecord[] = res?.data?.records || [];

      const filtered = records.filter((r) => {
        const d = new Date(r.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      });

      const daysInMonth = new Date(year, month, 0).getDate();
      const todayDate = new Date();
      const allDays: AttendanceRecord[] = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dateStr = date.toISOString().split("T")[0];
        const record = filtered.find((r) => new Date(r.date).toISOString().split("T")[0] === dateStr);
        if (!record && date <= todayDate) {
          allDays.push({ date: dateStr, status: "absent", checkIn: null, checkOut: null });
        } else if (record) {
          allDays.push(record);
        }
      }

      setRecent(allDays);

      const present  = allDays.filter((r) => r.status === "present").length;
      const late     = allDays.filter((r) => r.status === "late").length;
      const halfDay  = allDays.filter((r) => r.status === "half-day").length;
      const absent   = allDays.filter((r) => r.status === "absent").length;
      const totalDays = present + late + halfDay + absent;
      const attendanceRate = totalDays > 0 ? ((present + late + halfDay) / totalDays) * 100 : 0;

      setStats({ present, late, halfDay, absent, attendanceRate });

      if (!preserveClockState) {
        const todayISO = new Date().toISOString().split("T")[0];
        const todayRecord = allDays.find((r) => new Date(r.date).toISOString().split("T")[0] === todayISO);
        if (todayRecord) {
          setStatus(todayRecord.status);
          setIsClockedIn(!!todayRecord.checkIn && !todayRecord.checkOut);
        } else {
          setStatus("Not checked in");
          setIsClockedIn(false);
        }
      }
    } catch (err: any) {
      console.error("Error fetching attendance", err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAttendance(); }, [user, month, year]);

  const handleClock = async () => {
    if (!user?._id) return;
    try {
      let res;
      if (isClockedIn) {
        res = await axios.post(`/api/attendance/checkout/${user._id}`);
        toast.success(res?.data?.message || "Checked out successfully");
        setIsClockedIn(false);
        setStatus("Not checked in");
        fetchAttendance(true);
      } else {
        res = await axios.post(`/api/attendance/checkin/${user._id}`);
        toast.success(res?.data?.message || "Checked in successfully");
        setIsClockedIn(true);
        setStatus("present");
        setTimeout(() => fetchAttendance(true), 2000);
      }
    } catch (err: any) {
      console.error("Check In/Out failed", err);
      const msg = err?.response?.data?.message;
      if (msg?.includes("Already checked in")) {
        toast.error(msg);
        setIsClockedIn(true);
        setStatus("present");
      } else {
        toast.error(msg || err?.message || "Something went wrong");
      }
    }
  };

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const years  = Array.from({ length: 6 }, (_, i) => today.getFullYear() - 2 + i);

  // ── Progress bar width for attendance rate
  const rateWidth = `${Math.min(stats.attendanceRate, 100).toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-screen-lg mx-auto px-6 py-8 space-y-6">

        {/* ── Page Header ── */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-1 h-5 rounded-full bg-blue-600" />
            <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">My Workspace</p>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track your daily check-in status and monthly records</p>
        </div>

        {/* ── Clock In / Out Card ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 px-6 py-5">
            <div className="flex items-center gap-4">
              {/* Animated clock icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isClockedIn ? "bg-emerald-50" : "bg-slate-100"}`}>
                <Clock size={22} className={isClockedIn ? "text-emerald-600" : "text-slate-500"} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Attendance Control</p>
                <p className="text-base font-bold text-slate-900">
                  {today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">Today's Status:</span>
                  <StatusBadge status={status === "Not checked in" ? "absent" : status} />
                  {status === "Not checked in" && (
                    <span className="text-xs text-slate-400 italic">Not checked in</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleClock}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all ${
                isClockedIn
                  ? "bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white"
              }`}
            >
              {isClockedIn ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  Check Out
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Check In
                </>
              )}
            </button>
          </div>

          {/* Attendance rate progress strip */}
          <div className="border-t border-slate-100 px-6 py-3 bg-slate-50/60 flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-500 shrink-0">
              Attendance Rate
            </span>
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: rateWidth }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700 tabular-nums shrink-0">
              {stats.attendanceRate.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Present",   value: stats.present,  accent: "text-emerald-600", iconBg: "bg-emerald-50", bar: "bg-emerald-500", dot: "bg-emerald-500" },
            { label: "Late",      value: stats.late,     accent: "text-amber-600",   iconBg: "bg-amber-50",   bar: "bg-amber-500",   dot: "bg-amber-500"   },
            { label: "Half-Day",  value: stats.halfDay,  accent: "text-sky-600",     iconBg: "bg-sky-50",     bar: "bg-sky-500",     dot: "bg-sky-500"     },
            { label: "Absent",    value: stats.absent,   accent: "text-rose-600",    iconBg: "bg-rose-50",    bar: "bg-rose-500",    dot: "bg-rose-500"    },
          ].map((c, i) => {
            const total = stats.present + stats.late + stats.halfDay + stats.absent;
            const pct = total > 0 ? Math.round((c.value / total) * 100) : 0;
            return (
              <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.label}</span>
                  <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                </div>
                <div>
                  <span className={`text-3xl font-extrabold tabular-nums ${c.accent}`}>{c.value}</span>
                  <span className="ml-2 text-xs text-slate-400 font-medium">{pct}%</span>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Calendar + Records ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Calendar Legend Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50">
                  <Calendar size={15} className="text-blue-600" />
                </span>
                <h3 className="text-sm font-semibold text-slate-800">Calendar View</h3>
              </div>

              {/* Month / Year selectors */}
              <div className="flex gap-2">
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="text-xs border border-slate-200 bg-slate-50 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="text-xs border border-slate-200 bg-slate-50 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                {months[month - 1]} {year}
              </p>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Present",  dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
                  { label: "Late",     dot: "bg-amber-500",   badge: "bg-amber-50 text-amber-700 border border-amber-200"       },
                  { label: "Half-Day", dot: "bg-sky-500",     badge: "bg-sky-50 text-sky-700 border border-sky-200"             },
                  { label: "Absent",   dot: "bg-rose-500",    badge: "bg-rose-50 text-rose-700 border border-rose-200"          },
                ].map(({ label, dot, badge }) => (
                  <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${badge}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                    {label}
                  </div>
                ))}
              </div>

              {/* Mini summary */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Working Days</p>
                  <p className="text-sm font-bold text-slate-800">
                    {stats.present + stats.late + stats.halfDay + stats.absent}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Attended</p>
                  <p className="text-sm font-bold text-slate-800">
                    {stats.present + stats.late + stats.halfDay}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Records */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-slate-100">
                  <Clock size={15} className="text-slate-500" />
                </span>
                <h3 className="text-sm font-semibold text-slate-800">Recent Records</h3>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {recent.length} days
              </span>
            </div>

            <div className="overflow-y-auto max-h-72">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs">Loading records…</p>
                </div>
              ) : recent.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                  <Calendar size={28} className="text-slate-300" />
                  <p className="text-sm font-medium text-slate-500">No records found</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-50">
                  {recent.map((r, i) => (
                    <li key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/80 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-slate-600">
                            {new Date(r.date).getDate()}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-700">
                            {new Date(r.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          </p>
                          {(r.checkIn || r.checkOut) && (
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {r.checkIn && `In: ${r.checkIn}`}
                              {r.checkIn && r.checkOut && " · "}
                              {r.checkOut && `Out: ${r.checkOut}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={r.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;