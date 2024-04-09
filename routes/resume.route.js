// routes/resumeRoute.js
const express = require("express");
const router = express.Router();
const resumeController = require("../controller/resume.controller");

// POST route to generate DOCX
router.post("/generate-docx", resumeController.generateDocx);

// GET route to convert DOCX to HTML
router.get("/convert", resumeController.convertToHtml);

// POST route to save edited DOCX
router.post("/save", resumeController.saveEditedDocx);

module.exports = router;
