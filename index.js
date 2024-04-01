const express = require("express");
const generateDocxTemplate = require("./generateDocxTemplate");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/generate-docx", async (req, res) => {
  try {
    const formData = req.body;
    const htmlContent = await generateDocxTemplate(formData);
    res.send(htmlContent);
  } catch (error) {
    console.error("Error generating DOCX template:", error);
    throw new Error("Error generating DOCX template: " + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
