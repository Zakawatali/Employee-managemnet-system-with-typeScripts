
// import React, { useContext, useState, ReactNode } from "react";
// import { UserInfoContext } from "../../context/contextApi";
// import Sidebar from "../../components/sideBar";
// import {
//   User,
//   Mail,
//   Phone,
//   Building2,
//   Calendar,
//   BriefcaseBusiness,
//   BadgeCheck,
//   GraduationCap,
// } from "lucide-react";

// // ✅ Type definitions
// interface UserType {
//   _id?: string;
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   phone?: string;
//   image?: string;
//   dateOfBirth?: string;
//   education?: string;
//   department?: string;
//   position?: string;
//   experience?: string;
//   address?: string;
// }

// interface CardProps {
//   title: string;
//   children: ReactNode;
//   className?: string;
// }

// interface InfoRowProps {
//   icon: ReactNode;
//   label: string;
//   value?: string | null;
//   editMode: boolean;
//   type?: string;
// }

// const Profile: React.FC = () => {
//   const { user } = useContext<{ user?: UserType }>(UserInfoContext);
//   const [editMode, setEditMode] = useState<boolean>(false);

//   if (!user) {
//     return <div className="p-10 text-center text-gray-600">Loading user data...</div>;
//   }

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
//       {/* Sidebar */}
      

//       {/* Main Content */}
//       <div className="flex-1 p-4 md:p-8 mt-12 md:mt-0 overflow-auto">
//         <div className="max-w-6xl mx-auto space-y-6">

//           {/* Header */}
//           <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center gap-6">
//             <div className="w-28 h-28 rounded-full overflow-hidden shadow-md flex-shrink-0">
//               <img
//                 src={user.image || "/default-profile.png"}
//                 alt="profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             <div className="flex-1 text-center md:text-left">
//               <h2 className="text-3xl font-bold">{user.firstName} {user.lastName}</h2>
//               <p className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm opacity-90">
//                 <Mail className="w-4 h-4" /> {user.email}
//               </p>
//               <p className="flex items-center justify-center md:justify-start gap-2 mt-1 text-sm opacity-90">
//                 <Phone className="w-4 h-4" /> {user.phone || "N/A"}
//               </p>
//             </div>

//             <button
//               onClick={() => setEditMode(!editMode)}
//               className="mt-4 md:mt-0 md:ml-auto bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
//             >
//               {editMode ? "Save Changes" : "Edit Profile"}
//             </button>
//           </div>

//           {/* Info Cards */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <Card title="Personal Information">
//               <InfoRow icon={<User />} label="Full Name" value={`${user.firstName} ${user.lastName}`} editMode={editMode} />
//               <InfoRow icon={<Calendar />} label="Date of Birth" value={user.dateOfBirth?.substring(0,10)} editMode={editMode} type="date" />
//               <InfoRow icon={<GraduationCap />} label="Education" value={user.education} editMode={editMode} />
//             </Card>

//             <Card title="Job Details">
//               <InfoRow icon={<Building2 />} label="Department" value={user.department} editMode={editMode} />
//               <InfoRow icon={<BriefcaseBusiness />} label="Position" value={user.position} editMode={editMode} />
//               <InfoRow icon={<BadgeCheck />} label="Experience" value={user.experience} editMode={editMode} />
//             </Card>

//             <Card title="Contact Information" className="md:col-span-2">
//               <InfoRow icon={<Phone />} label="Phone" value={user.phone} editMode={editMode} />
//               <InfoRow icon={<Building2 />} label="Address" value={user.address} editMode={editMode} />
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Card Component
// const Card: React.FC<CardProps> = ({ title, children, className = "" }) => {
//   return (
//     <div className={`bg-white rounded-2xl shadow p-6 space-y-4 ${className}`}>
//       <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">{title}</h3>
//       <div className="space-y-3">{children}</div>
//     </div>
//   );
// };

// // InfoRow Component
// const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, editMode, type = "text" }) => {
//   return (
//     <div className="flex items-center gap-3">
//       <div className="text-blue-600 flex-shrink-0">{icon}</div>
//       <div className="flex-1">
//         <p className="text-sm text-gray-500">{label}</p>
//         {editMode ? (
//           <input
//             type={type}
//             defaultValue={value || ""}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
//           />
//         ) : (
//           <p className="text-gray-800 font-medium">{value || "N/A"}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;
import React, { useContext, useState, useEffect, ReactNode } from "react";
import axios from "../../util/axiosInstance";
import { UserInfoContext } from "../../context/contextApi";
import Sidebar from "../../components/sideBar";
import {
  User, Mail, Phone, Building2, Calendar, BriefcaseBusiness,
  BadgeCheck, GraduationCap, MapPin, ShieldCheck, XCircle, Hash
} from "lucide-react";

// --- Types ---
interface UserType {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  image?: string;
  dateOfBirth?: string;
  education?: string;
  department?: string;
  position?: string;
  experience?: string;
  address?: string;
  employeeCode?: string;
  role?: string;
  status?: string;
  createdAt?:string
}

type TabType = "overview" | "employment" | "documents";

const Profile: React.FC = () => {
  const context = useContext(UserInfoContext) as any;
  const contextUser = context?.user;
  
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [formData, setFormData] = useState<UserType>({});

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!contextUser?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`/api/employee/${contextUser._id}`);
        
        // ✅ DRILL DOWN: The data is at res.data.data.employee
        const employeeData = res.data?.data?.employee;
        
        if (employeeData) {
          setUser(employeeData);
          setFormData(employeeData);
        }
      } catch (error) {
        console.error("Enterprise API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [contextUser?._id]);

  const handleInputChange = (field: keyof UserType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // await axios.put(`/api/employee/${user?._id}`, formData);
      setUser(formData);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleCancel = () => {
    setFormData(user || {});
    setEditMode(false);
  };

  if (loading) return <ProfileSkeleton />;
  if (!user) return <div className="p-20 text-center text-gray-500 font-medium">Employee record not found.</div>;

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="h-40 bg-gradient-to-r from-indigo-700 to-purple-700 w-full" />

        <div className="max-w-5xl mx-auto px-4 pb-12 -mt-20">
          {/* Main Header Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              <div className="relative group">
                <img
                  // Note: Adjusted image path logic in case your backend serves from a specific port
                  src={user.image ? `http://localhost:5000${user.image}` : "/default-profile.png"}
                  alt="Profile"
                  className="w-40 h-40 rounded-3xl border-8 border-white shadow-2xl object-cover bg-gray-50"
                />
                <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full border-4 border-white text-[10px] font-bold text-white shadow-lg ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}>
                  {user.status}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    {user.firstName} {user.lastName}
                  </h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-widest border border-indigo-100">
                    {user.role}
                  </span>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full"><Hash className="w-4 h-4 text-indigo-500" /> {user.employeeCode}</span>
                  <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full"><BriefcaseBusiness className="w-4 h-4 text-indigo-500" /> {user.position}</span>
                  <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full"><Building2 className="w-4 h-4 text-indigo-500" /> {user.department}</span>
                </div>
              </div>

              <div className="flex gap-3">
                {editMode ? (
                  <>
                    <button onClick={handleCancel} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                      <ShieldCheck className="w-4 h-4" /> Save
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditMode(true)} className="bg-white border-2 border-indigo-50 text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-10 mt-12 border-b border-gray-100">
              {(["overview", "employment", "documents"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-5 text-sm font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {activeTab === "overview" && (
                <Section title="Personal Information">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                    <DataField icon={<User />} label="First Name" value={formData.firstName} field="firstName" editMode={editMode} onChange={handleInputChange} />
                    <DataField icon={<User />} label="Last Name" value={formData.lastName} field="lastName" editMode={editMode} onChange={handleInputChange} />
                    <DataField icon={<Mail />} label="Email Address" value={user.email} editMode={false} />
                    <DataField icon={<Phone />} label="Phone Number" value={formData.phone} field="phone" editMode={editMode} onChange={handleInputChange} />
                    <DataField icon={<Calendar />} label="Date of Birth" value={formData.dateOfBirth?.split('T')[0]} field="dateOfBirth" editMode={editMode} type="date" onChange={handleInputChange} />
                    <DataField icon={<GraduationCap />} label="Education Level" value={formData.education} field="education" editMode={editMode} onChange={handleInputChange} />
                  </div>
                </Section>
              )}

              {activeTab === "employment" && (
                <Section title="Employment Context">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                    <DataField icon={<Building2 />} label="Business Unit" value={formData.department} field="department" editMode={editMode} onChange={handleInputChange} />
                    <DataField icon={<BriefcaseBusiness />} label="Designation" value={formData.position} field="position" editMode={editMode} onChange={handleInputChange} />
                    <DataField icon={<BadgeCheck />} label="Years of Experience" value={formData.experience} field="experience" editMode={editMode} onChange={handleInputChange} />
                    <DataField icon={<Hash />} label="Employee ID" value={user.employeeCode} editMode={false} />
                  </div>
                </Section>
              )}
            </div>

            <div className="space-y-8">
              <Section title="Location">
                <DataField icon={<MapPin />} label="Permanent Address" value={formData.address} field="address" editMode={editMode} onChange={handleInputChange} />
              </Section>
              
              <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
                <h4 className="font-bold text-lg mb-2">Corporate Portal</h4>
                <p className="text-indigo-100 text-xs leading-relaxed opacity-80 mb-4">
                  Member since {new Date(user.createdAt || "").toLocaleDateString()}
                </p>
                <div className="h-1 w-12 bg-indigo-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Atomic Components ---

const Section: React.FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/30">
      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</h3>
    </div>
    <div className="p-8">{children}</div>
  </div>
);

const DataField: React.FC<{ 
  icon: ReactNode; label: string; value?: string; editMode: boolean; 
  type?: string; field?: keyof UserType; onChange?: (f: keyof UserType, v: string) => void 
}> = ({ icon, label, value, editMode, type = "text", field, onChange }) => (
  <div className="flex items-start gap-5">
    <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm">
      {React.cloneElement(icon as React.ReactElement, { })}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-black text-indigo-300 uppercase mb-1.5 tracking-wider">{label}</p>
      {editMode && field && onChange ? (
        <input 
          type={type} 
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full text-sm font-bold text-gray-700 border-2 border-indigo-50 rounded-xl px-4 py-2.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
        />
      ) : (
        <p className="text-sm font-bold text-gray-800 break-words leading-tight">{value || "Unset"}</p>
      )}
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="flex min-h-screen bg-gray-50 animate-pulse">
    <div className="w-64 bg-white h-full border-r" />
    <div className="flex-1 p-12 space-y-8">
      <div className="h-64 bg-gray-200 rounded-[2rem]" />
      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-2 h-96 bg-gray-200 rounded-[2rem]" />
        <div className="h-96 bg-gray-200 rounded-[2rem]" />
      </div>
    </div>
  </div>
);

export default Profile;