import mongoose from "mongoose";

export function DatabaseConnection() 
{
  mongoose
    .connect("mongodb://127.0.0.1:27017/imageDemo")
    .then(() => {
      console.log("connected sucessfully!!");
    })
    .catch((err) => {
      console.log(err);
    });
}