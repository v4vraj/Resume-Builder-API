const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const generateDocxTemplate = async (formData) => {
  try {
    const content = fs.readFileSync(
      path.resolve(__dirname, "templates.docx"),
      "binary"
    );
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
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
      experience: formData.experience,
      projects: formData.projects,
      skills: formData.skills,
    });

    const uniqueFilename = `${formData.firstName}_${Date.now()}.docx`;
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });
    fs.writeFileSync(path.resolve(__dirname, uniqueFilename), buf);

    console.log("DOCX template generated successfully 1.");
    return { filename: uniqueFilename, buffer: buf };
  } catch (error) {
    console.error("Error generating DOCX template 1:", error);
  }
};

module.exports = generateDocxTemplate;
