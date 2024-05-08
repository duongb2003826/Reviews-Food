const Location = require('../models/Location');
const User = require('../models/User')

const createReview = async (req, res) => {
  const {user} = req.body
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { content, rating } = req.body;    
    const location = await Location.findById(req.params.id);
    try {
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      const review = {
        userName: user.name,
        email: user.email,
        content,
        rating
      };
      location.reviews.push(review);
      await location.save();
      return res.status(201).json(review);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
};


const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const locationId = req.body.locationId;
  const userId = req.body.userId;
  const user = await User.findById(userId)
  const userName = user.name
  try {
    const location = await Location.findById(locationId);

    // Find the index of the review in the reviews array
    const reviewIndex = location.reviews.findIndex(
      (review) => review._id.toString() === reviewId
    );
    
    if (reviewIndex < 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is authorized to delete the review
    if (location.reviews[reviewIndex].userName !== userName) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Remove the review from the reviews array
    location.reviews.splice(reviewIndex, 1);

    // Save the updated location document
    await location.save();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
    createReview,
    deleteReview,

}