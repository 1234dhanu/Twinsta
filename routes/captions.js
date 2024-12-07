const express = require("express");
const router = express.Router();
const Caption = require("../models/captionModel");

// Route to fetch captions with pagination based on a keyword
router.get("/fetch-captions", async (req, res) => {
  try {
    const { keyword, page = 0, limit = 5 } = req.query;

    // Check if the keyword is provided
    if (!keyword) {
      return res.status(400).json({ error: "Keyword is required" });
    }

    // Parse the page and limit values
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // Fetch captions with pagination
    const captions = await Caption.find({ keyword })
      .skip(pageNumber * pageSize)
      .limit(pageSize);

    // Check if captions are found
    const totalCount = await Caption.countDocuments({ keyword });
    const hasNext = (pageNumber + 1) * pageSize < totalCount;
    const hasPrevious = pageNumber > 0;

    if (!captions || captions.length === 0) {
      return res.status(404).json({ error: "No captions found for the given keyword" });
    }

    // Send captions and pagination metadata
    res.json({
      captions,
      hasNext,
      hasPrevious,
    });
  } catch (error) {
    console.error("Error fetching captions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
