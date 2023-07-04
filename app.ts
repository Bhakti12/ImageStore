import app from "./express";
import { DatabaseConnection } from "./db";
import multer from "multer";
import {GridFsStorage} from "multer-gridfs-storage";
import mongoose from "mongoose";
import express from "express";

const port = 3000;

let bucket: mongoose.mongo.GridFSBucket;
mongoose.connection.on("connected", ()=>{
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db,{
    bucketName : "ImageStore"
  });
  //console.log(bucket);
})

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const storage = new GridFsStorage({
  url : "mongodb://127.0.0.1:27017/imageDemo",
  file : (req,file) => {
    return new Promise((resolve,reject)=>{
      const filename = file.originalname;
      const fileInfo = {
        filename : filename,
        bucketName : "ImageStore"
      };
      resolve(fileInfo);
    });
  }
});

const upload = multer({
  storage
});

app.post("/upload", upload.single("image"), (req,res) => {
  res.status(200).send("image uploaded successfully!");
});

app.get("/fileinfo/:filename",async(req,res)=>{
    try{
      const filename = bucket.openDownloadStreamByName(req.params.filename)
      filename.on("data",function(data){
        return res.status(200).write(data)
      })
      filename.on("error",function(data){
        return res.status(404).json({error : "image not found"})
      })
      filename.on("end",()=>{
        return res.end()
      })
    }
    catch(err){
      console.log(err);
    }
});

app.listen(port, () => {
  DatabaseConnection();
  console.log("server :- ", port);
});