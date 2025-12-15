// import React, { useState, useEffect, useContext } from "react";
// import { Download, FileText, Filter, Calendar, Loader2 } from "lucide-react";
// import axios from "../../util/axiosInstance";
// import { UserInfoContext } from "../../context/contextApi";



// export default function Reports() {
//   const { user } = useContext(UserInfoContext);
//   console.log("TEST LOG");  // Should print always
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   console.log("the user id is",user._id)
//   const fetchReports = async () => {
//     if (!user?._id) return;
//     console.log(user._id)
//     try {
//       const res = await axios.get(`/api/documents/${user._id}`);
//       console.log(res.data)
//       setReports(res.data?.report || []);
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Dummy Fetch Reports
//   useEffect(() => {
    
//     fetchReports();
//   }, [user?._id]);

//   return (
//     <div className="px-2 p-6 sm:px-0 w-full">
//       {/* Header */}
//       <div className="flex items-center justify-between border-b pb-4 mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">📊 Reports</h1>
//           <p className="text-gray-500 text-sm">Generate, view, and download reports</p>
//         </div>
//         <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition">
//           <Download size={18} /> Download All
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 mb-6">
//         <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//           <option>All Months</option>
//           <option>January</option>
//           <option>February</option>
//           <option>March</option>
//         </select>
//         <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//           <option>2025</option>
//           <option>2024</option>
//           <option>2023</option>
//         </select>
//         <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">
//           <Filter size={16} /> Apply
//         </button>
//       </div>

//       {/* Report Table */}
//       {loading ? (
//         <div className="flex justify-center items-center py-10 text-gray-500">
//           <Loader2 size={24} className="animate-spin mr-2" />
//           Loading reports...
//         </div>
//       ) : reports.length === 0 ? (
//         <p className="text-gray-500 text-sm">No reports available</p>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded-xl shadow border">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Title
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {reports.map((report, idx) => (
//                 <tr key={idx} className="hover:bg-gray-50 transition">
//                   <td className="px-6 py-4 flex items-center gap-3 text-gray-800">
//                     <FileText className="text-blue-600" size={20} />
//                     {report.title}
//                   </td>
//                   <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
//                     <Calendar size={16} /> {report.date}
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
//                       <Download size={16} /> Download
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect, useContext } from "react";
import { Download, FileText, Filter, Calendar, Loader2 } from "lucide-react";
import axios from "../../util/axiosInstance";
import { UserInfoContext } from "../../context/contextApi";

export default function Reports() {
  const { user } = useContext(UserInfoContext);

  // ✅ States
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Debug logs
  console.log("TEST LOG - component rendered");
  console.log("Current user:", user);
  console.log("User ID:", user?._id);

  // ✅ Fetch reports
  const fetchReports = async () => {
    if (!user?._id) return; // Wait until user._id exists
    console.log("Fetching reports for user:", user._id);
    try {
      const res = await axios.get(`/api/documents/${user._id}`);
      console.log("Reports fetched:", res.data);
      setReports(res.data?.report || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch reports when user._id becomes available
  useEffect(() => {
    fetchReports();
  }, [user?._id]);

  // ✅ Show loading if user or data is not ready
  if (!user?._id || loading) {
    return (
      <div className="flex justify-center items-center py-10 text-gray-500">
        <Loader2 size={24} className="animate-spin mr-2" />
        Loading reports...
      </div>
    );
  }

  return (
    <div className="px-2 p-6 sm:px-0 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📊 Reports</h1>
          <p className="text-gray-500 text-sm">Generate, view, and download reports</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition">
          <Download size={18} /> Download All
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Months</option>
          <option>January</option>
          <option>February</option>
          <option>March</option>
        </select>
        <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>2025</option>
          <option>2024</option>
          <option>2023</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">
          <Filter size={16} /> Apply
        </button>
      </div>

      {/* Report Table */}
      {reports.length === 0 ? (
        <p className="text-gray-500 text-sm">No reports available</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((report, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3 text-gray-800">
                    <FileText className="text-blue-600" size={20} /> {report.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                    <Calendar size={16} /> {report.date}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      <Download size={16} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
