const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const url = "mongodb://127.0.0.1:27017";
const mongoose = require("mongoose");
const userRoute = require("./controller/routes/userRoute");
const profileRoute = require("./controller/routes/profileRoute");
const articleRoute = require("./controller/routes/articleRoute");
const commentRoute = require("./controller/routes/commentRoute");
const tagRoute = require("./controller/routes/tagRoute");

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err: Error) => console.log(err));

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// const auth = require("./controller/auth/authMiddleware");
// import { ReqExtendUser } from "./controller/auth/reqExtendUser";
// import { Response } from "express";

// app.use("/test", auth, (req: ReqExtendUser, res: Response) => {
//     res.send(req.user);
// });

app.use("/api", userRoute, profileRoute, articleRoute, commentRoute, tagRoute);
