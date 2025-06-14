import express from "express";
import {
  getReviews,
  addReview,
  getSentiment
} from "../controller/reviewc.js";

const router = express.Router();

router.get("/sentiment/:productId", getSentiment); // must come first!
router.get("/:productId", getReviews);
router.post("/:productId", addReview);

export default router;
