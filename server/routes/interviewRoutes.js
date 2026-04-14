const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  uploadResume,
  evaluate,
} = require("../controllers/interviewController");

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.post("/evaluate", protect, evaluate);

module.exports = router;
