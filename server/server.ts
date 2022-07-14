const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const mongoose = require("mongoose");
const userRoute = require("./controller/routes/userRoute");
const profileRoute = require("./controller/routes/profileRoute");
const articleRoute = require("./controller/routes/articleRoute");
const commentRoute = require("./controller/routes/commentRoute");
const tagRoute = require("./controller/routes/tagRoute");
require("dotenv").config();

app.use(express.json({ extended: false, limit: "50mb" }));
app.use(
    express.urlencoded({
        limit: "50mb",
        extended: false,
        parameterLimit: 50000,
    })
);

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
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
