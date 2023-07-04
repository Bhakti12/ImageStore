import app from "./express";
import { DatabaseConnection } from "./db";
import multer from "multer";
import multerS3 from "multer-s3";
import {S3Client} from "@aws-sdk/client-s3";

const port = 3000;

const s3 = new S3Client({
  credentials : {
    accessKeyId : "AKIAUAO6ZVLH4JJ35EVP",
    secretAccessKey : "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"
  },
  region : "US East (N. Virginia) us-east-1"
})

const s3Bucket = multerS3({
  s3 : s3,
  bucket : "dhruv-images",
  acl : "public-read",
  metadata : (req, file, cb) => {
    cb(null,{image : file.fieldname});
  },
  key : (req,file,cb)=>{
    const filename = Date.now() + file.fieldname + file.originalname;
    cb(null,filename);
  }
})

//middleware
const uploadImage = multer({
  storage : s3Bucket,
  fileFilter : (req,file,cb)=>{
    file.mimetype = ".jpg",".png",".jpeg",".gif"
  },
  limits : {
    fileSize : 1024 * 1024 * 2
  }
});

const upload = uploadImage.single("image");

app.post("/upload",upload,function(req,res,next){
  res.json({image : req.file?.destination})
});

app.listen(port, () => {
  DatabaseConnection();
  console.log("server :- ", port);
});