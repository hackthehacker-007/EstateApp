import express from "express";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import userRoute from "./routes/user.route.js";

const app = express();

app.use("/api/auth", authRoute);

app.listen(8000, () => {
  console.log("server is running!");
});
