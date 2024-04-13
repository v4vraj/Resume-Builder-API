// controllers/resumeController.js
const generateDocxTemplate = require("../generateDocxTemplate");
const mammoth = require("mammoth");
const Resume = require("../models/resume.model");
const fs = require("fs");
const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3();

exports.generateDocx = async (req, res) => {
  try {
    const formData = req.body;
    const { filename, buffer } = await generateDocxTemplate(formData);
    console.log("docxBuffer", buffer);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    let docxUrl;
    console.log("check", process.env.NODE_ENV);
    if (process.env.NODE_ENV.trim() === "development") {
      // Save the file locally for development
      console.log("Entering development environment");
      const filePath = `C:/Users/Vraj/Documents/resume-builder/Server/${filename}`;
      // Inside the if block for the development environment
      console.log("Is docxBuffer a Buffer?", Buffer.isBuffer(buffer));

      try {
        fs.writeFileSync(filePath, buffer);
        console.log("File saved successfully:", filePath);
      } catch (err) {
        console.error("Error writing file:", err);
        throw err;
      }

      console.log("filePath", filePath);
      docxUrl = `http://localhost:10000/${filename}`;
    } else {
      console.log("WE are here");
      // Upload the file to S3 if in production
      const bucketName = "resumecollection";
      const key = filename;
      const s3UploadResponse = await uploadFileToS3(buffer, bucketName, key);
      docxUrl = s3UploadResponse.Location;
      console.log(s3UploadResponse);
    }

    const resume = new Resume(formData);
    resume.docxUrl = docxUrl;
    await resume.save();

    res.send(docxBuffer);
  } catch (error) {
    res.status(500).json({ error: "Error generating DOCX template" });
  }
};

exports.convertToHtml = (req, res) => {
  try {
    mammoth.convertToHtml({ path: "templates.docx" }).then((result) => {
      let html = result.value;

      html = html.replace(/<h\d>/g, "<hr>$&");

      res.send(html);
    });
  } catch (error) {
    console.error("Error converting to HTML:", error);
    res.status(500).json({ error: "Error converting document to HTML" });
  }
};

exports.saveEditedDocx = (req, res) => {
  try {
    const editedHtml = req.body.html;
    const editedDocx = htmlToDocx(editedHtml);
    res.send(editedDocx);
  } catch (error) {
    console.error("Error saving edited DOCX:", error);
    res.status(500).json({ error: "Error saving edited DOCX" });
  }
};

const uploadFileToS3 = (fileBuffer, bucketName, key) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
  };

  return s3.upload(params).promise();
};
