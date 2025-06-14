import Review from "../models/review.js";
import Product from "../models/product.js";
import axios from "axios";

// GET /api/reviews/:productId
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// POST /api/reviews/:productId
export const addReview = async (req, res) => {
  const { text } = req.body;
  try {
    const review = new Review({ productId: req.params.productId, text });
    await review.save();
    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ message: "Failed to add review" });
  }
};


// GET /api/reviews/sentiment/:productId
export const getSentiment = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    const allText = reviews.map((r) => r.text).join("\n");

    const response = await axios.post(
      "https://cloud.flowiseai.com/api/v1/prediction/00284454-9903-4b35-8728-67fcbce8b7f9",
      {
        question: `Give an overall sentiment score out of 10 and a 2-line summary for the following reviews (do not mention phrases like 'the first review says'): \n${allText}`
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const aiText = response.data.text || "No sentiment response.";

    // Extract sentiment score
    const scoreMatch = aiText.match(/(\d+(?:\.\d+)?)\/10/);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : null;

    // Remove anything like "Sentiment Score:", "Summary:", and the score itself
    let summary = aiText
      .replace(/Sentiment Score\s*:/i, '')
      .replace(/Summary\s*:/gi, '')
      .replace(/(\d+(?:\.\d+)?)\/10/, '')
      .trim();

    res.status(200).json({
      score: score || "N/A",
      summary,
    });
  } catch (error) {
    res.status(500).json({ message: "Sentiment analysis failed" });
  }
};

