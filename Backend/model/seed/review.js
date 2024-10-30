const Review = require("../review.model");

const reviews = [
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 5,
    comment: "Excellent test! Really helped me prepare for the real exam.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 4,
    comment:
      "Good variety of questions, though some were a bit too challenging.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 5,
    comment: "The explanations for each answer were very helpful.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 3,
    comment: "Decent practice material but could use more advanced questions.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 4,
    comment: "Well-structured test with good progression of difficulty.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 5,
    comment: "Perfect simulation of the actual test environment!",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 4,
    comment: "Very comprehensive coverage of all topics.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 5,
    comment: "The timing feature really helped me improve my speed.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 3,
    comment: "Good practice but needs more variety in question types.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 4,
    comment: "Clear instructions and well-organized sections.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 5,
    comment: "Outstanding preparation material! Highly recommend.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 4,
    comment: "Good balance of easy and difficult questions.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 5,
    comment: "The detailed feedback system is incredibly helpful.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 4,
    comment: "Very realistic test scenarios and questions.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 5,
    comment: "Excellent practice for time management skills.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 4,
    comment: "Great resource for exam preparation.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 5,
    comment: "The interface is user-friendly and intuitive.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 4,
    comment: "Helpful practice materials with good explanations.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 5,
    comment: "One of the best practice tests I've taken.",
  },
  {
    test: "671bbc5d3e42879b0be78638",
    user: "66eda220f1577aa9a314ab30",
    rating: 4,
    comment: "Would definitely recommend for serious test preparation.",
  },
];

async function seedReviews() {
  try {
    const result = await Review.insertMany(reviews);
    return result;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { reviews, seedReviews };
