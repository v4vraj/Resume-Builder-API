const { generateDescription } = require("../controller/aiController");
const express = require("express");
const router = express.Router();

router.post("/generate-description", generateDescription);

module.exports = router;
