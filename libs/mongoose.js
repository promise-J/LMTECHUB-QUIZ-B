import mongoose from "mongoose";

export default function dbConnect() {
  mongoose
    .connect(process.env.DBURL)
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(err));
}
