import React, { useState } from "react";
import axios from "axios";

const ReviewForm = ({ carId, fetchReviews }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleAddReview = async () => {
    await axios.post("http://localhost:1337/api/reviews", {
      rating,
      comment,
      car: carId,  
    });
    fetchReviews(carId); 
    setRating(0);
    setComment("");
  };

  return (
    <div>
      <h4>Add Review</h4>
      <input
        type="number"
        value={rating}
        placeholder="Rating"
        min="1"
        max="5"
        onChange={(e) => setRating(e.target.value)}
      />
      <input
        type="text"
        value={comment}
        placeholder="Comment"
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={handleAddReview}>Submit Review</button>
    </div>
  );
};

export default ReviewForm;
