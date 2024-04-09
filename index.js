const express = require("express");
const generateDocxTemplate = require("./generateDocxTemplate");
const cors = require("cors");
const mammoth = require("mammoth");
const resumeRoute = require("./routes/resume.route.js"); // Import your routes
const connectDB = require("./db.js");
require("dotenv").config();

const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const app = express();
app.use(express.json());
app.use(cors());

connectDB();
// Use your resume routes
app.use("/api", resumeRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
