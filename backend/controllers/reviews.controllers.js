const { reviews, books } = require("../models");
const Reviews = reviews;

const getReviewsByBookID = async (req, res) => {
  const id = req.params.id;
  const reviewList = await Reviews.findAll({
    include: [books],
    order: [["id", "ASC"]],
    where: {
      book_id: id,
    },
  });

  return res.status(200).json(reviewList);
};

module.exports = {
  getReviewsByBookID,
};
