import app from "./express";
import express from "express";
import { DatabaseConnection } from "./db";
import multer from "multer";
import multerS3 from "multer-s3";
import {S3Client} from "@aws-sdk/client-s3";
import path from "path";
import util from "util";

const port = 3000;

const config = {
  region: "",
  credentials: {
      accessKeyId: "",
      secretAccessKey: ""
  }
}
const s3 = new S3Client(config);

const upload = multer({
  storage: multerS3({
      s3,
      acl: 'public-read',
      bucket: "dhruv-images",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {   
          const fileName = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
          cb(null, `${fileName}${path.extname(file.originalname)}`);
      }
  })
});

const uploadSingleV2 = async (req:express.Request, res:express.Response) => {
  const uploadFile = util.promisify(upload.single('image'));
  try {
      await uploadFile(req, res); 
      res.json(req.file);
  } catch (error) { 
    console.log(error);
      res.status(500).json({ error });
  } 
}

app.post("/upload",uploadSingleV2);

app.listen(port, () => {
  DatabaseConnection();
  console.log("server :- ", port);
});
