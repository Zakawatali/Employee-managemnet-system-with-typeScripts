
// import React, { useContext, useEffect, useState } from "react";
// import axios from "../../util/axiosInstance";
// import { Calendar, Clock, UserCheck } from "lucide-react";
// import { UserInfoContext } from "../../context/contextApi";
// import toast from "react-hot-toast";

// const Attendance = () => {
//   const { user } = useContext(UserInfoContext);
//   const [status, setStatus] = useState("Not checked in");
//   const [isClockedIn, setIsClockedIn] = useState(false);
//   const [stats, setStats] = useState({
//     present: 0,
//     late: 0,
//     halfDay: 0,
//     absent: 0,
//     attendanceRate: 0,
//   });
//   console.log(user)
//   const [recent, setRecent] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const today = new Date();
//   const [month, setMonth] = useState(today.getMonth() + 1);
//   const [year, setYear] = useState(today.getFullYear());

//   // ✅ Fetch Attendance
// // ✅ Fetch Attendance
// const fetchAttendance = async (preserveClockState = false) => {
//   if (!user?._id) return;
//   try {
//     setLoading(true);
//     const res = await axios.get(`/api/attendance/${user._id}`);
//     const records = res?.data?.records || [];

//     // ✅ Filter by selected month/year
//     const filtered = records.filter((r) => {
//       const d = new Date(r.date);
//       return d.getMonth() + 1 === month && d.getFullYear() === year;
//     });

//     // ✅ Generate full list of days for current month
//     const daysInMonth = new Date(year, month, 0).getDate();
//     const today = new Date();

//     const allDays = [];
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month - 1, day);
//       const dateStr = date.toISOString().split("T")[0];
//       const record = filtered.find(
//         (r) => new Date(r.date).toISOString().split("T")[0] === dateStr
//       );

//       // ✅ If no check-in record for this day and it's a past date, mark absent
//       if (!record && date <= today) {
//         allDays.push({
//           date: dateStr,
//           status: "absent",
//           checkIn: null,
//           checkOut: null,
//         });
//       } else if (record) {
//         allDays.push(record);
//       }
//     }

//     setRecent(allDays);

//     // ✅ Count statuses (matching backend logic)
//     const present = allDays.filter((r) => r.status === "present").length;
//     const late = allDays.filter((r) => r.status === "late").length;
//     const halfDay = allDays.filter((r) => r.status === "half-day").length;
//     const absent = allDays.filter((r) => r.status === "absent").length;

//     const totalDays = present + late + halfDay + absent;
//     const attendanceRate =
//       totalDays > 0 ? ((present + late + halfDay) / totalDays) * 100 : 0;

//     setStats({ present, late, halfDay, absent, attendanceRate });

//     // ✅ Only update today's clock state if not preserving
//     if (!preserveClockState) {
//       const todayDate = new Date().toISOString().split("T")[0];
//       const todayRecord = allDays.find(
//         (r) => new Date(r.date).toISOString().split("T")[0] === todayDate
//       );

//       if (todayRecord) {
//         setStatus(todayRecord.status);
//         setIsClockedIn(todayRecord.checkIn && !todayRecord.checkOut);
//       } else {
//         setStatus("Not checked in");
//         setIsClockedIn(false);
//       }
//     }
//   } catch (err) {
//     console.error("Error fetching attendance", err);
//     toast.error(err?.response?.data?.message || "Something went wrong");
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   fetchAttendance();
// }, [user, month, year]);

// const handleClock = async () => {
//   if (!user?._id) return;
//   try {
//     let res;

//     if (isClockedIn) {
//       // ✅ Checkout
//       res = await axios.post(`/api/attendance/checkout/${user._id}`);
//       toast.success(res?.data?.message || "Checked out successfully");
//       setIsClockedIn(false);
//       setStatus("Not checked in");
//       fetchAttendance(true);
//     } else {
//       // ✅ Checkin
//       res = await axios.post(`/api/attendance/checkin/${user._id}`);
//       toast.success(res?.data?.message || "Checked in successfully");
//       setIsClockedIn(true);
//       setStatus("present");

//       // 🚀 Don’t let backend overwrite immediately
//       setTimeout(() => {
//         fetchAttendance(true);
//       }, 2000);
//     }
//   } catch (err) {
//     console.error("Check In/Out failed", err);
//     const msg = err?.response?.data?.message;

//     if (msg?.includes("Already checked in")) {
//       toast.error(msg);
//       setIsClockedIn(true);
//       setStatus("present");
//     } else {
//       toast.error(msg || err?.message || "Something went wrong");
//     }
//   }
// };



//   const months = [
//     "January","February","March","April","May","June",
//     "July","August","September","October","November","December",
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

// ✅ Types
interface User {
  _id?: string;
  name?: string;
}

interface AttendanceRecord {
  date: string; // ISO string
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

const Attendance: React.FC = () => {
  const { user } = useContext<{ user?: User }>(UserInfoContext);

  const [status, setStatus] = useState<string>("Not checked in");
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats>({
    present: 0,
    late: 0,
    halfDay: 0,
    absent: 0,
    attendanceRate: 0,
  });

  const [recent, setRecent] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [year, setYear] = useState<number>(today.getFullYear());

  // ✅ Fetch Attendance
  const fetchAttendance = async (preserveClockState = false) => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const res = await axios.get(`/api/attendance/${user._id}`);
      const records: AttendanceRecord[] = res?.data?.records || [];

      // Filter by selected month/year
      const filtered = records.filter((r) => {
        const d = new Date(r.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      });

      // Generate full list of days for current month
      const daysInMonth = new Date(year, month, 0).getDate();
      const todayDate = new Date();

      const allDays: AttendanceRecord[] = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dateStr = date.toISOString().split("T")[0];

        const record = filtered.find(
          (r) => new Date(r.date).toISOString().split("T")[0] === dateStr
        );

        if (!record && date <= todayDate) {
          allDays.push({
            date: dateStr,
            status: "absent",
            checkIn: null,
            checkOut: null,
          });
        } else if (record) {
          allDays.push(record);
        }
      }

      setRecent(allDays);

      // Count statuses
      const present = allDays.filter((r) => r.status === "present").length;
      const late = allDays.filter((r) => r.status === "late").length;
      const halfDay = allDays.filter((r) => r.status === "half-day").length;
      const absent = allDays.filter((r) => r.status === "absent").length;

      const totalDays = present + late + halfDay + absent;
      const attendanceRate =
        totalDays > 0 ? ((present + late + halfDay) / totalDays) * 100 : 0;

      setStats({ present, late, halfDay, absent, attendanceRate });

      // Update today's clock state
      if (!preserveClockState) {
        const todayISO = new Date().toISOString().split("T")[0];
        const todayRecord = allDays.find(
          (r) => new Date(r.date).toISOString().split("T")[0] === todayISO
        );

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

  useEffect(() => {
    fetchAttendance();
  }, [user, month, year]);

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

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from({ length: 6 }, (_, i) => today.getFullYear() - 2 + i);

  return (
    <div className="p-6 space-y-8">
      {/* Clock In/Out */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-md flex items-center justify-between text-white">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" /> Attendance Control
          </h3>
          <p className="text-sm opacity-80">Today’s Status</p>
          <p className="text-xl font-bold mt-1">{status}</p>
        </div>
        <button
          onClick={handleClock}
          className={`px-6 py-2 rounded-lg font-medium shadow-md transition ${
            isClockedIn
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isClockedIn ? "Check Out" : "Check In"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md">
          <p className="text-sm text-gray-500">Attendance Rate</p>
          <p className="text-2xl font-bold text-indigo-600">
            {stats.attendanceRate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md">
          <p className="text-sm text-gray-500">Present</p>
          <p className="text-2xl font-bold text-green-600">{stats.present}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md">
          <p className="text-sm text-gray-500">Late</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md">
          <p className="text-sm text-gray-500">Half-Day</p>
          <p className="text-2xl font-bold text-blue-600">{stats.halfDay}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md">
          <p className="text-sm text-gray-500">Absent</p>
          <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
        </div>
      </div>

      {/* Calendar & Recent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-indigo-500" /> Calendar View
            </h3>
            <div className="flex gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="border rounded-md px-3 py-1 text-sm"
              >
                {months.map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="border rounded-md px-3 py-1 text-sm"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            {months[month - 1]} {year}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500"></span> Present
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Late
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span> Half-Day
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span> Absent
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Records
          </h3>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : recent.length === 0 ? (
            <p className="text-gray-400 text-sm">No records found</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {recent.map((r, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-50"
                >
                  <span>{new Date(r.date).toLocaleDateString()}</span>
                  <span
                    className={`font-semibold ${
                      r.status === "present"
                        ? "text-green-600"
                        : r.status === "late"
                        ? "text-yellow-600"
                        : r.status === "half-day"
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
