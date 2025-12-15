import {
  Schema,
  model,
  Document,
  Types,
  CallbackWithoutResultAndOptionalError,
} from "mongoose";

export type AttendanceStatus = "present" | "absent" | "late" | "half-day";

export interface IAttendance extends Document {
  employeeId: Types.ObjectId;
  date: Date;
  status: AttendanceStatus;
  checkIn?: Date;
  checkOut?: Date;
  hoursWorked: number;
}
 export type AttendanceDocument = IAttendance;
const attendanceSchema = new Schema<IAttendance>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "EmployeeProfile",
    required: true,
  },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["present", "absent", "late", "half-day"],
    default: "absent",
  },
  checkIn: { type: Date },
  checkOut: { type: Date },
  hoursWorked: { type: Number, default: 0 },
});

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

attendanceSchema.pre<IAttendance>(
  "save",
  function (next: CallbackWithoutResultAndOptionalError) {
  if (this.checkIn) {
    if (this.checkOut) {
      const diffMs = this.checkOut.getTime() - this.checkIn.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      this.hoursWorked = Math.ceil(diffHours);
    } else {
      this.hoursWorked = 0;
    }

    const checkInDate = new Date(this.checkIn);
    const localHour = checkInDate.getHours();
    const time = localHour + 12;
    console.log("Check-in hour (local):", time);

    if (this.checkIn) {
      if (this.hoursWorked < 6 && this.checkOut) {
        this.status = "half-day";
      } else if (time >= 10) {
        this.status = "late";
      } else {
        this.status = "present";
      }
    } else {
      this.hoursWorked = 0;
      this.status = "absent";
    }
  }

    next();
  }
);

export default model<IAttendance>("Attendance", attendanceSchema);