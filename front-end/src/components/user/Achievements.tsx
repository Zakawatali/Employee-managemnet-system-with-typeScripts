
// import React, { useContext, useEffect, useState } from "react";
// import axios from "../../util/axiosInstance";
// import { UserInfoContext } from "../../context/contextApi";
// import { AlertCircle, Loader2, Trophy, Download } from "lucide-react";
// import Layout from "../Layout";

// // ✅ Types
// interface User {
//   _id?: string;
//   firstName?: string;
//   lastName?: string;
//   role?: string;
// }

// interface Achievement {
//   _id: string;
//   title?: string;
//   body?: string;
//   createdAt?: string;
// }

// const Achievements: React.FC = () => {
//   const { user } = useContext<{ user?: User }>(UserInfoContext);
//   const [achievements, setAchievements] = useState<Achievement[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState<number>(1);           // current page
// const [totalPages, setTotalPages] = useState<number>(1);
//   const limit=2;

//   // ✅ Fetch Achievements
//   const fetchAchievements = async (page:number=1) => {
//     if (!user?._id) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const res = await axios.get<{ data: { data: Achievement[],page: number; totalPages: number } }>(
//         `/api/achievements/${user._id}?page=${page}&limit=${limit}`
//       );
//       console.log("the achivement is",res.data.data)
//       setPage(res.data.data.page)
//       setTotalPages(res.data.data.totalPages)

//       const data = res.data?.data?.data || [];
//       console.log("the response is", data);

//       setAchievements(Array.isArray(data) ? data : []);
//     } catch (err: any) {
//       console.error("Error fetching achievements:", err);
//       setError("Failed to load achievements. Please try again later.");
//       setAchievements([]); // Reset to empty array on error
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAchievements(page);
//   }, [user?._id]);

//   // ✅ Download Achievements as JSON
//   const handleDownload = () => {
//     const blob = new Blob([JSON.stringify(achievements, null, 2)], {
//       type: "application/json",
//     });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `achievements_${user?._id}.json`;
//     link.click();
//     URL.revokeObjectURL(url); // Clean up the URL object
//   };

//   return (
   
//       <div className="space-y-6 overflow-auto text-gray-800">
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
//             <Trophy size={28} className="text-yellow-600" /> My Achievements
//           </h1>
//           {achievements.length > 0 && (
//             <button
//               onClick={handleDownload}
//               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
//             >
//               <Download size={18} /> Download
//             </button>
//           )}
//         </div>
//         <h2 className="text-gray-500 text-sm">
//           You can view and download your achievements here.
//         </h2>

//         <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
//           {loading ? (
//             <div className="flex justify-center py-10 text-indigo-600">
//               <Loader2 className="animate-spin w-10 h-10" />
//             </div>
//           ) : error ? (
//             <div className="flex flex-col items-center justify-center text-red-500 py-16 bg-red-50 rounded-xl shadow-inner">
//               <AlertCircle size={50} className="mb-4" />
//               <p className="text-lg font-medium">{error}</p>
//               {/* <button
//                 onClick={fetchAchievements()}
//                 className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//               >
//                 Retry
//               </button> */}
//             </div>
//           ) : achievements.length === 0 ? (
//             <div className="flex flex-col items-center justify-center text-gray-500 py-16 bg-gray-50 rounded-xl shadow-inner">
//               <AlertCircle size={50} className="mb-4 text-gray-400" />
//               <p className="text-lg font-medium">No Achievements yet.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {achievements.map((achievement) => (
//                 <div
//                   key={achievement._id}
//                   className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition"
//                 >
//                   <h2 className="text-lg font-semibold text-gray-800 mb-2">
//                     {achievement.title || "Untitled Achievement"}
//                   </h2>
//                   <p className="text-gray-600 mb-2">
//                     {achievement.body || "No description provided."}
//                   </p>
//                   <p className="text-sm text-gray-400">
//                     Awarded on:{" "}
//                     {achievement.createdAt
//                       ? new Date(achievement.createdAt).toLocaleDateString()
//                       : "—"}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
          
//         </div>
//        <div className=" ">

      
// <div className="flex justify-between items-center mt-4">
//   <button
//     disabled={page === 1}
//     onClick={() => fetchAchievements(page - 1)}
//     className="px-4 py-2 border rounded disabled:opacity-50"
//   >
//     Previous
//   </button>

//   <span className="text-sm">
//     Page {page} of {totalPages}
//   </span>

//   <button
//     disabled={page === totalPages}
//     onClick={() => fetchAchievements(page + 1)}
//     className="px-4 py-2 border rounded disabled:opacity-50"
//   >
//     Next
//   </button>
// </div>

//        </div>

//       </div>
    
//   );
// };

// export default Achievements;
import React, { useContext, useEffect, useState } from "react";
import axios from "../../util/axiosInstance";
import { UserInfoContext } from "../../context/contextApi";
import { AlertCircle, Loader2, Trophy, Download } from "lucide-react";
import Layout from "../Layout";

// ✅ Types (UNCHANGED)
interface User {
  _id?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface Achievement {
  _id: string;
  title?: string;
  body?: string;
  createdAt?: string;
}

// ------------------------
// ACHIEVEMENT CARD
// ------------------------
const trophyColors = [
  { bg: "bg-amber-50",   border: "border-amber-200",  icon: "text-amber-500",  badge: "bg-amber-100 text-amber-700"   },
  { bg: "bg-violet-50",  border: "border-violet-200", icon: "text-violet-500", badge: "bg-violet-100 text-violet-700" },
  { bg: "bg-sky-50",     border: "border-sky-200",    icon: "text-sky-500",    badge: "bg-sky-100 text-sky-700"       },
  { bg: "bg-emerald-50", border: "border-emerald-200",icon: "text-emerald-500",badge: "bg-emerald-100 text-emerald-700"},
  { bg: "bg-rose-50",    border: "border-rose-200",   icon: "text-rose-500",   badge: "bg-rose-100 text-rose-700"    },
];

const AchievementCard: React.FC<{ achievement: Achievement; index: number }> = ({ achievement, index }) => {
  const palette = trophyColors[index % trophyColors.length];
  return (
    <div className={`relative bg-white rounded-xl border ${palette.border} shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col`}>
      {/* Top accent strip */}
      <div className={`h-1 w-full ${palette.bg} border-b ${palette.border}`} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Icon + Title */}
        <div className="flex items-start gap-3">
          <span className={`w-9 h-9 rounded-xl ${palette.bg} border ${palette.border} flex items-center justify-center shrink-0`}>
            <Trophy size={17} className={palette.icon} />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-sm leading-snug">
              {achievement.title || "Untitled Achievement"}
            </h3>
          </div>
        </div>

        {/* Body */}
        <p className="text-xs text-slate-500 leading-relaxed flex-1">
          {achievement.body || "No description provided."}
        </p>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Awarded On</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${palette.badge}`}>
            {achievement.createdAt
              ? new Date(achievement.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
};

// ------------------------
// MAIN COMPONENT
// ------------------------
const Achievements: React.FC = () => {
  const { user } = useContext<{ user?: User }>(UserInfoContext);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 2;

  // ✅ FETCH (UNCHANGED)
  const fetchAchievements = async (page: number = 1) => {
    if (!user?._id) { setLoading(false); return; }
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<{ data: { data: Achievement[]; page: number; totalPages: number } }>(
        `/api/achievements/${user._id}?page=${page}&limit=${limit}`
      );
      console.log("the achivement is", res.data.data);
      setPage(res.data.data.page);
      setTotalPages(res.data.data.totalPages);
      const data = res.data?.data?.data || [];
      console.log("the response is", data);
      setAchievements(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching achievements:", err);
      setError("Failed to load achievements. Please try again later.");
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAchievements(page); }, [user?._id]);

  // ✅ DOWNLOAD (UNCHANGED)
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(achievements, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `achievements_${user?._id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-screen-lg mx-auto px-6 py-8 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-1 h-5 rounded-full bg-blue-600" />
              <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">My Workspace</p>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Achievements</h1>
            <p className="text-sm text-slate-500 mt-0.5">View and download your recognition records</p>
          </div>

          {achievements.length > 0 && (
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Download size={15} />
              Download
            </button>
          )}
        </div>

        {/* ── Content Card ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="p-1.5 rounded-lg bg-amber-50 border border-amber-100">
                <Trophy size={15} className="text-amber-500" />
              </span>
              <h2 className="text-sm font-semibold text-slate-800">Achievement Records</h2>
              {!loading && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {achievements.length} {achievements.length === 1 ? "record" : "records"}
                </span>
              )}
            </div>
            {totalPages > 1 && !loading && (
              <span className="text-xs text-slate-400">
                Page <span className="font-medium text-slate-600">{page}</span> of{" "}
                <span className="font-medium text-slate-600">{totalPages}</span>
              </span>
            )}
          </div>

          {/* Body */}
          <div className="p-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                <Loader2 className="animate-spin w-7 h-7 text-blue-600" />
                <p className="text-sm text-slate-500">Loading achievements…</p>
              </div>

            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                  <AlertCircle size={22} className="text-rose-500" />
                </div>
                <p className="text-sm font-medium text-rose-600">{error}</p>
                <p className="text-xs text-slate-400">Please try again later</p>
              </div>

            ) : achievements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <Trophy size={22} className="text-amber-400" />
                </div>
                <p className="text-sm font-medium text-slate-500">No achievements yet</p>
                <p className="text-xs text-slate-400">Your achievements will appear here once awarded</p>
              </div>

            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, i) => (
                  <AchievementCard key={achievement._id} achievement={achievement} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* ── Pagination footer ── */}
          {!loading && achievements.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60">
              <button
                disabled={page === 1}
                onClick={() => fetchAchievements(page - 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchAchievements(p)}
                    className={`w-7 h-7 rounded-md text-xs font-semibold transition ${
                      p === page
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => fetchAchievements(page + 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Achievements;