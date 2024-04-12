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
    console.log(formData);
    const { filename, docxBuffer } = await generateDocxTemplate(formData);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    let docxUrl;
    if (process.env.NODE_ENV === "production") {
      // Upload the file to S3 if in production
      const bucketName = "resumecollection";
      const key = filename;
      const s3UploadResponse = await uploadFileToS3(
        docxBuffer,
        bucketName,
        key
      );
      docxUrl = s3UploadResponse.Location;
    } else {
      // Save the file locally for development
      const filePath = `C:/Users/Vraj/Documents/resume-builder/Server/${filename}`;
      fs.writeFileSync(filePath, docxBuffer);
      docxUrl = `http://localhost:3000/${filename}`; // Assuming your local server runs on port 3000
    }

    const resume = new Resume(formData);
    resume.docxUrl = docxUrl;
    await resume.save();

    res.send(docxBuffer);
  } catch (error) {
    console.error("Error generating DOCX template:", error);
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
