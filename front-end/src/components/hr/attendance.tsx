

// import React, { useEffect, useState } from "react";
// import axios from "../../util/axiosInstance";
// import toast from "react-hot-toast";
// import { FaUserCheck, FaUserClock, FaUserTimes } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// // Format date to YYYY-MM-DD for date picker
// const toYYYYMMDD = (d = new Date()) =>
//   [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");

// // Format date to MM-DD-YYYY for API calls
// const toMMDDYYYY = (dateStr) => {
//   const [year, month, day] = dateStr.split("-");
//   return `${month}-${day}-${year}`;
// };

// // Normalize status values
// const normalizeStatus = (raw) => {
//   if (!raw && raw !== 0) return "Absent";
//   const s = String(raw).toLowerCase();
//   if (s.includes("present")) return "Present";
//   if (s.includes("late")) return "Late";
//   if (s.includes("half")) return "Half-day";
//   if (s.includes("abs")) return "Absent";
//   return s.charAt(0).toUpperCase() + s.slice(1);
// };

// // Map UI label back to API format
// const mapStatusToApi = (label) => {
//   if (!label) return "absent";
//   const t = String(label).toLowerCase();
//   if (t === "half-day") return "half-day";
//   if (t === "present") return "present";
//   if (t === "late") return "late";
//   return "absent";
// };

// // Recalculate summary counts
// const recalcSummary = (list = []) => {
//   const counts = { present: 0, late: 0, "half-day": 0, absent: 0 };
//   list.forEach((r) => {
//     const s = (r.status || "").toLowerCase();
//     if (s.includes("present")) counts.present++;
//     else if (s.includes("late")) counts.late++;
//     else if (s.includes("half")) counts["half-day"]++;
//     else counts.absent++;
//   });
//   return counts;
// };

// export default function Attendance() {
//   const navigate = useNavigate();
  
//   const [selectedDate, setSelectedDate] = useState(toYYYYMMDD());
//   const [summary, setSummary] = useState({ present: 0, late: 0, "half-day": 0, absent: 0 });
//   const [employees, setEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [savingId, setSavingId] = useState(null);

//   // Fetch summary - converts date format for API
//   const fetchSummary = async (date) => {
//     try {
//       const apiDate = toMMDDYYYY(date); // Convert YYYY-MM-DD to MM-DD-YYYY
//       const res = await axios.get(`/api/attendance/summary/daily?date=${apiDate}`);

//       if (res.data.success && res.data.data?.summary) {
//         setSummary(res.data.data.summary);
//       } else {
//         setSummary({ present: 0, late: 0, "half-day": 0, absent: 0 });
//       }
//     } catch (err) {
//       console.error("fetchSummary error:", err);
//       toast.error(err?.response?.data?.message || "Unable to fetch summary");
//       setSummary({ present: 0, late: 0, "half-day": 0, absent: 0 });
//     }
//   };

//   // Fetch employees from /api/attendance/getAttendance
//   const fetchEmployees = async (date) => {
//     setLoading(true);
//     try {
//       // Fetch all attendance records
//       const res = await axios.get("/api/attendance/getAttendance");
      
//       console.log("API Response:", res.data);

//       if (!res.data.success) {
//         throw new Error("Failed to fetch attendance");
//       }

//       // Get records from the nested data.records structure
//       let records = res.data.data?.records || [];
      
//       console.log("All records:", records);

//       // Filter by selected date
//       const filteredRecords = records.filter((rec) => {
//         const recordDate = rec.date;
//         if (!recordDate) return false;
        
//         try {
//           const dt = new Date(recordDate);
//           const formattedDate = toYYYYMMDD(dt);
//           return formattedDate === date;
//         } catch {
//           return false;
//         }
//       });

//       console.log("Filtered records for", date, ":", filteredRecords);

//       // Normalize records to match the UI structure
//       const normalized = filteredRecords.map((rec) => {
//         const empObj = rec.employeeId || {};
//         const name = `${empObj.firstName || ""} ${empObj.lastName || ""}`.trim() || "Unknown";
//         const department = empObj.department || "-";
//         const status = normalizeStatus(rec.status);

//         return {
//           ...rec,
//           _id: rec._id,
//           employeeId: empObj,
//           name,
//           department,
//           status,
//         };
//       });

//       setEmployees(normalized);
//       setFilteredEmployees(normalized);
      
//       // Update summary from filtered records
//       const calculatedSummary = recalcSummary(normalized);
//       setSummary(calculatedSummary);
      
//     } catch (err) {
//       console.error("fetchEmployees error:", err);
//       toast.error(err?.response?.data?.message || "Unable to fetch attendance records");
//       setEmployees([]);
//       setFilteredEmployees([]);
//       setSummary({ present: 0, late: 0, "half-day": 0, absent: 0 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch data when date changes
//   useEffect(() => {
//     fetchEmployees(selectedDate);
//     fetchSummary(selectedDate);
//     // eslint-disable-next-line
//   }, [selectedDate]);

//   // Handle search filtering
//   useEffect(() => {
//     if (!search.trim()) {
//       setFilteredEmployees(employees);
//       return;
//     }
//     const q = search.toLowerCase();
//     setFilteredEmployees(
//       employees.filter((e) => {
//         const name = (e.name || "").toLowerCase();
//         const email = (e.employeeId?.email || "").toLowerCase();
//         const dept = (e.department || "").toLowerCase();
//         return name.includes(q) || email.includes(q) || dept.includes(q);
//       })
//     );
//   }, [search, employees]);

//   // Save status to backend
//   const handleSave = async (attendanceId, statusLabel) => {
//     if (!attendanceId) return toast.error("Invalid record");
    
//     try {
//       setSavingId(attendanceId);
//       const apiStatus = mapStatusToApi(statusLabel);

//       const res = await axios.put(`/api/attendance/${attendanceId}`, {
//         status: apiStatus,
//       });

//       if (res?.data?.success) {
//         toast.success("Attendance updated successfully");
        
//         // Update local state
//         const updated = employees.map((r) => 
//           r._id === attendanceId ? { ...r, status: statusLabel } : r
//         );
//         setEmployees(updated);
//         setFilteredEmployees(updated);
//         setSummary(recalcSummary(updated));
//       } else {
//         toast.error(res?.data?.message || "Update failed");
//       }
//     } catch (err) {
//       console.error("handleSave error:", err);
//       toast.error(err?.response?.data?.message || "Error saving attendance");
//     } finally {
//       setSavingId(null);
//     }
//   };

//   return (
//     <div className="p-6">
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
// }
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
  employeeId: Employee; // Not optional anymore
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
// HELPER FUNCTIONS
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
// COMPONENT
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
  // FETCH SUMMARY
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
  // FETCH EMPLOYEES
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

  // Run whenever date changes
  useEffect(() => {
    fetchEmployees(selectedDate);
    fetchSummary(selectedDate);
  }, [selectedDate]);

  // ------------------------
  // SEARCH FILTER
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
  // SAVE HANDLER
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

  // ------------------------
  // UI
  // ------------------------
  return (
        <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Daily Attendance</h2>
          <p className="text-sm text-gray-500">Select date to view/update attendance</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-500 mb-4">Loading attendance...</p>}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Present", value: summary.present ?? 0, gradient: "from-emerald-500 to-emerald-600", icon: <FaUserCheck size={26} /> },
          { title: "Late", value: summary.late ?? 0, gradient: "from-amber-400 to-amber-500", icon: <FaUserClock size={26} /> },
          { title: "Half-day", value: summary["half-day"] ?? 0, gradient: "from-indigo-500 to-indigo-600", icon: <FaUserClock size={26} /> },
          { title: "Absent", value: summary.absent ?? 0, gradient: "from-rose-500 to-rose-600", icon: <FaUserTimes size={26} /> },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${c.gradient} text-white`}>{c.icon}</div>
            <div>
              <div className="text-sm text-gray-500">{c.title}</div>
              <div className="text-2xl font-extrabold">{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3 mb-4">
        <input
          placeholder="Search by name / email / department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Employees table */}
      <div className="bg-white rounded-2xl shadow overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 divide-y">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                  {loading ? "Loading..." : `No records found for ${selectedDate}`}
                </td>
              </tr>
            ) : (
              filteredEmployees.map((r, idx) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3">{r.employeeId?.email || "-"}</td>
                  <td className="px-4 py-3">{r.department || "-"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        // Update local state optimistically
                        setEmployees((prev) => prev.map((el) => (el._id === r._id ? { ...el, status: newStatus } : el)));
                        setFilteredEmployees((prev) => prev.map((el) => (el._id === r._id ? { ...el, status: newStatus } : el)));
                        
                        // Update summary instantly
                        const updatedList = filteredEmployees.map((el) => (el._id === r._id ? { ...el, status: newStatus } : el));
                        setSummary(recalcSummary(updatedList));
                      }}
                      className="border rounded px-2 py-1"
                    >
                      <option>Present</option>
                      <option>Late</option>
                      <option>Half-day</option>
                      <option>Absent</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleSave(r._id, r.status)}
                      disabled={savingId === r._id}
                      className={`px-3 py-1 rounded text-white ${savingId === r._id ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                      {savingId === r._id ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
