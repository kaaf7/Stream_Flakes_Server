/* * 👇
 *This is server side index.js
 *It will connect to PORT and MongoDB server
 *It will connect all routes with URI
 */

 const mongoose = require("mongoose");
 const userRout = require("./routes/user");
 const authRoute = require("./routes/auth");

const express = require("express");
 const app = express();
 const cors = require("cors");
 app.use(cors());
 app.use(express.json());
 const dotenv = require("dotenv");
 dotenv.config();
 const PORT_URL = process.env.PORT_URL;
 const MONGO_CLUSTER_URL = process.env.MONGO_CLUSTER_URL;

 app.listen(PORT_URL, () => {
   console.log("connected");
 });

 mongoose
   .connect(MONGO_CLUSTER_URL)
   .then(() => {
     console.log("DB Connected");
   })
   .catch((err) => {
     console.log(err);
   });
 // get api
 app.get("/api", (req, res) => {
   res.send("API");
 });
 // use all routs
 app.use("/api/user", userRout);
 app.use("/api/auth", authRoute);

 