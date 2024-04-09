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
    // Set headers for downloading the file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Generate a unique filename based on firstName and current timestamp

    const filePath = `C:/Users/Vraj/Documents/resume-builder/Server/${filename}`;

    // Upload file to S3 with the unique filename
    const bucketName = "resumecollection"; // Replace with your S3 bucket name
    const key = filename; // Use the unique filename as the key in S3
    const s3UploadResponse = await uploadFileToS3(filePath, bucketName, key);

    // Create a new resume object with the form data
    const resume = new Resume(formData);
    // Store the S3 URL in the resume object
    resume.docxUrl = s3UploadResponse.Location;

    // Save the resume object to the database
    await resume.save();

    // Send the generated .docx file buffer as response
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

      // Insert <hr> before each heading
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
    const editedHtml = req.body.html; // Assuming HTML content is sent in the request body
    // Save or process the edited HTML content as needed
    // Convert edited HTML back to DOCX if required
    const editedDocx = htmlToDocx(editedHtml);
    // Send response or save the edited DOCX file
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
