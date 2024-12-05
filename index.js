const express = require("express");
const generateDocxTemplate = require("./generateDocxTemplate");
const cors = require("cors");
const mammoth = require("mammoth");
const resumeRoute = require("./routes/resume.route.js");
const connectDB = require("./db.js");
require("dotenv").config();
const aiRoute = require("./routes/ai.route.js");
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

// Register routes
app.use("/api/resumes", resumeRoute); // For resume-related routes
app.use("/api/ai", aiRoute); // For AI-related routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
