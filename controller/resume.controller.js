// controllers/resumeController.js
const generateDocxTemplate = require("../generateDocxTemplate");
const mammoth = require("mammoth");
const Resume = require("../models/resume.model");
const fs = require("fs");
const AWS = require("aws-sdk");

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
    const filePath = `C:/Users/Vraj/Documents/resume-builder/Server/${filename}`;
    const bucketName = "resumecollection";
    const key = filename;
    const s3UploadResponse = await uploadFileToS3(filePath, bucketName, key);

    const resume = new Resume(formData);

    resume.docxUrl = s3UploadResponse.Location;

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

const uploadFileToS3 = (filePath, bucketName, key) => {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
  };

  return s3.upload(params).promise();
};
