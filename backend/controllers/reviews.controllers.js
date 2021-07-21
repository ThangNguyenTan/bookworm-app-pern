const { reviews, books } = require("../models");
const { sortReviewsQuery } = require("../utils/sorter");
const { StatusCodes } = require("http-status-codes");
const { getReviewsStatus } = require("../business/reviews.business");
const Reviews = reviews;

const getReviewsByBookID = async (req, res) => {
  const id = req.params.id;

  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query["page-size"]) || 15;
  const ratings = req.query.ratings;
  const sortCriteria = req.query.sort || "datedesc";

  let ratingsWhere =
    ratings && ratings != "0"
      ? {
          rating_start: ratings,
        }
      : {};

  const reviewList = await Reviews.findAndCountAll({
    include: [books],
    where: {
      book_id: id,
      ...ratingsWhere,
    },
    order: [sortReviewsQuery(sortCriteria)],
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
  });

  const reviewsStatus = await getReviewsStatus(id);

  return res.status(StatusCodes.OK).json({
    reviews: {
      data: reviewList.rows,
      total: reviewList.count,
      currentPage: currentPage,
      perPage: pageSize,
    },
    reviewsStatus,
  });
};

const createReview = async (req, res) => {
  const id = req.params.id;

  const createdReview = await reviews.create({
    ...req.body,
    bookId: id,
  });

  return res.status(StatusCodes.CREATED).json(createdReview);
};

module.exports = {
  getReviewsByBookID,
  createReview,
};
