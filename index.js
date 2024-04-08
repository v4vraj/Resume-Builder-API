const express = require("express");
const generateDocxTemplate = require("./generateDocxTemplate");
const cors = require("cors");
const mammoth = require("mammoth");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/generate-docx", async (req, res) => {
  try {
    const formData = req.body;
    const docxBuffer = await generateDocxTemplate(formData);
    console.log(docxBuffer);
    // Set headers for downloading the file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", 'attachment; filename="output.docx"');

    // Send the generated .docx file buffer as response
    res.send(docxBuffer);
  } catch (error) {
    console.error("Error generating DOCX template:", error);
    throw new Error("Error generating DOCX template: " + error.message);
  }
});

app.get("/api/convert", (req, res) => {
  try {
    mammoth.convertToHtml({ path: "templates.docx" }).then((result) => {
      let html = result.value;

      // Insert <hr> before each heading
      html = html.replace(/<h\d>/g, "<hr>$&");

      console.log(html);
      res.send(html);
    });
  } catch (error) {
    console.error("Error converting to HTML:", error);
    res.status(500).send("Error converting document");
  }
});
app.post("/api/save", (req, res) => {
  const editedHtml = req.body.html; // Assuming HTML content is sent in the request body
  // Save or process the edited HTML content as needed
  // Convert edited HTML back to DOCX if required
  const editedDocx = htmlToDocx(editedHtml);
  // Send response or save the edited DOCX file
  res.send(editedDocx);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
