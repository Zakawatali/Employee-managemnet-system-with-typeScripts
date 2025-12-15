import path from "path";
import multer, { StorageEngine } from "multer";
import { Request } from "express";

const uploadsDir = path.resolve(__dirname, "../../uploads");

const storage: StorageEngine = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req: Request, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
