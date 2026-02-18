import EmployeeProfile, {
  EmployeeProfileDocument,
} from "../models/EmployeeProfile";
import User, { IUser } from "../models/User";

export const findUserByEmail = async (
  email: string
): Promise<EmployeeProfileDocument | null> => {
  return EmployeeProfile.findOne({ email });
};

// export const findAllUser = async (page: number = 1, limit: number = 10): Promise<{ users: IUser[]; total: number; totalPages: number ; page: number }> => {
//   const skip = (page - 1) * limit;

//   const users = await User.find()
//     .select("-password")
//     .skip(skip)
//     .limit(limit)
//     .exec();

//   const total = await User.countDocuments();
//   const totalPages = Math.ceil(total / limit);

//   return { users, total,page, totalPages };
// };

export const findAllUser = async (
  page: number = 1,
  limit: number = 10,
  search: string 
): Promise<{
  users: IUser[];
  total: number;
  totalPages: number;
  page: number;
}> => {
  const skip = (page - 1) * limit;

  const filter: any = {};

  // if (search) {
  //   filter.$or = [
  //     { firstName: { $regex: search, $options: "i" } },
  //     { lastName: { $regex: search, $options: "i" } },
  //   ];
  // }
  if (search && search.trim()) {
    const keyword = search.trim();
  
    filter.$or = [
      { firstName: { $regex: keyword, $options: "i" } },
      { lastName: { $regex: keyword, $options: "i" } },
    ];
  }
  const users = await User.find(filter)
    .select("-password")
    .skip(skip)
    .limit(limit)
    .sort({createdAt:-1})
    .exec();

  const total = await User.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  return { users, total, page, totalPages };
};

export const FindUserIdandEmail = async (
  userId: string
): Promise<IUser | null> => {
  return User.findById(userId);
};

export const FindEmployeeId = async (
  employeeId: string
): Promise<EmployeeProfileDocument | null> => {
  return EmployeeProfile.findById(employeeId);
};
 