const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const generateDocxTemplate = async (formData) => {
  try {
    // Load the DOCX template file
    const content = fs.readFileSync(
      path.resolve(__dirname, "templates.docx"),
      "binary"
    );
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the template
    doc.render({
      firstName: formData.firstName,
      lastName: formData.lastName,
      professionalTitle: formData.professionalTitle,
      email: formData.email,
      phoneNumber: formData.phone,
      linkedIn: formData.linkedIn,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      description: formData.description,
      educations: formData.educations,
      experience: formData.exprience,
      projects: formData.projects,
      skills: formData.skills,
    });

    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });
    fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);

    console.log("DOCX template generated successfully.");
    return buf;
  } catch (error) {
    console.error("Error generating DOCX template:", error);
  }
};

module.exports = generateDocxTemplate;
