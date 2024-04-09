const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  experienceDescription: String,
  joining: String,
  endDate: String,
});

const educationSchema = new mongoose.Schema({
  university: String,
  degree: String,
  year: String,
});

const projectSchema = new mongoose.Schema({
  projectTitle: String,
  githubLink: String,
  projectDescription: String,
});

const resumeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  professionalTitle: String,
  email: String,
  phone: String,
  linkedIn: String,
  city: String,
  state: String,
  country: String,
  description: String,
  educations: [educationSchema],
  skills: String,
  experience: [experienceSchema], // Add experience field
  projects: [projectSchema],
  docxUrl: String,
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
