
// import React, { useContext, useState } from "react";
// import { UserInfoContext } from "../../context/contextApi";
// import Sidebar from "../../components/sideBar";
// import {
//   User, Mail, Phone, Building2, Calendar,
//   BriefcaseBusiness, BadgeCheck, GraduationCap,
// } from "lucide-react";

// export default function Profile() {
//   const { user } = useContext(UserInfoContext); // 👈 context se user data
//   const [editMode, setEditMode] = useState(false);
//   console.log(user)

//   if (!user) {
//     return <div className="p-10 text-center text-gray-600">Loading user data...</div>;
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar />

//       <div className="flex-1 p-6 overflow-auto">
//         <div className="max-w-6xl mx-auto space-y-6">

//           {/* Header */}
//           <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center gap-6">
//             <div className="w-28 h-28 rounded-full overflow-hidden shadow-md">
//         <img
//           src={user.image || "/default-profile.png"} // fallback to a local image
//           alt="profile"
//           className="w-full h-full object-cover"
//         />

//             </div>
//             <div className="flex-1 text-center md:text-left">
//               <h2 className="text-3xl font-bold">{user.firstName} {user.lastName}</h2>
//               <p className="flex items-center gap-2 mt-2 text-sm opacity-90">
//                 <Mail className="w-4 h-4" /> {user.email}
//               </p>
//               <p className="flex items-center gap-2 mt-1 text-sm opacity-90">
//                 <Phone className="w-4 h-4" /> {user.phone || "N/A"}
//               </p>
//             </div>
//             {/* <button
//               onClick={() => setEditMode(!editMode)}
//               className="mt-4 md:mt-0 md:ml-auto bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
//             >
//               {editMode ? "Save Changes" : "Edit Profile"}
//             </button> */}
//           </div>

//           {/* Info Cards */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <Card title="Personal Information" className="">
//               <InfoRow icon={<User />} label="Full Name" value={`${user.firstName} ${user.lastName}`} editMode={editMode} />
//               <InfoRow icon={<Calendar />} label="Date of Birth" value={user.dateOfBirth?.substring(0,10)} editMode={editMode} type="date" />
//               <InfoRow icon={<GraduationCap />} label="Education" value={user.education} editMode={editMode} />
//             </Card>

//             <Card title="Job Details" className="">
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
// }

// // Card Component
// function Card({ title, children, className }) {
//   return (
//     <div className={`bg-white rounded-2xl shadow p-6 space-y-4 ${className}`}>
//       <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">{title}</h3>
//       <div className="space-y-3">{children}</div>
//     </div>
//   );
// }

// // InfoRow Component
// function InfoRow({ icon, label, value, editMode, type = "text" }) {
//   return (
//     <div className="flex items-center gap-3">
//       <div className="text-blue-600">{icon}</div>
//       <div className="flex-1">
//         <p className="text-sm text-gray-500">{label}</p>
//         {editMode ? (
//           <input
//             type={type}
//             defaultValue={value}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
//           />
//         ) : (
//           <p className="text-gray-800 font-medium">{value || "N/A"}</p>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useContext, useState, ReactNode } from "react";
import { UserInfoContext } from "../../context/contextApi";
import Sidebar from "../../components/sideBar";
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  BriefcaseBusiness,
  BadgeCheck,
  GraduationCap,
} from "lucide-react";

// ✅ Type definitions
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
}

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value?: string | null;
  editMode: boolean;
  type?: string;
}

const Profile: React.FC = () => {
  const { user } = useContext<{ user?: UserType }>(UserInfoContext);
  const [editMode, setEditMode] = useState<boolean>(false);

  if (!user) {
    return <div className="p-10 text-center text-gray-600">Loading user data...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 mt-12 md:mt-0 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-md flex-shrink-0">
              <img
                src={user.image || "/default-profile.png"}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold">{user.firstName} {user.lastName}</h2>
              <p className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm opacity-90">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2 mt-1 text-sm opacity-90">
                <Phone className="w-4 h-4" /> {user.phone || "N/A"}
              </p>
            </div>

            <button
              onClick={() => setEditMode(!editMode)}
              className="mt-4 md:mt-0 md:ml-auto bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
            >
              {editMode ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card title="Personal Information">
              <InfoRow icon={<User />} label="Full Name" value={`${user.firstName} ${user.lastName}`} editMode={editMode} />
              <InfoRow icon={<Calendar />} label="Date of Birth" value={user.dateOfBirth?.substring(0,10)} editMode={editMode} type="date" />
              <InfoRow icon={<GraduationCap />} label="Education" value={user.education} editMode={editMode} />
            </Card>

            <Card title="Job Details">
              <InfoRow icon={<Building2 />} label="Department" value={user.department} editMode={editMode} />
              <InfoRow icon={<BriefcaseBusiness />} label="Position" value={user.position} editMode={editMode} />
              <InfoRow icon={<BadgeCheck />} label="Experience" value={user.experience} editMode={editMode} />
            </Card>

            <Card title="Contact Information" className="md:col-span-2">
              <InfoRow icon={<Phone />} label="Phone" value={user.phone} editMode={editMode} />
              <InfoRow icon={<Building2 />} label="Address" value={user.address} editMode={editMode} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Card Component
const Card: React.FC<CardProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-2xl shadow p-6 space-y-4 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
};

// InfoRow Component
const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, editMode, type = "text" }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="text-blue-600 flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        {editMode ? (
          <input
            type={type}
            defaultValue={value || ""}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        ) : (
          <p className="text-gray-800 font-medium">{value || "N/A"}</p>
        )}
      </div>
    </div>
  );
};

export default Profile;