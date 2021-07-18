const { reviews, books } = require("../models");
const { paginate } = require("../utils/pagination");
const {
  generateGetNumberOfReviewsQuery,
  avgRatingsBookQuery,
} = require("../utils/queries");
const { sortReviewsQuery } = require("../utils/sorter");
const Reviews = reviews;
const Books = books;

const getReviewsStatus = async (bookID) => {
  // Create count query for each rating type from 1 to 5
  const q1 = generateGetNumberOfReviewsQuery(1, bookID);
  const q2 = generateGetNumberOfReviewsQuery(2, bookID);
  const q3 = generateGetNumberOfReviewsQuery(3, bookID);
  const q4 = generateGetNumberOfReviewsQuery(4, bookID);
  const q5 = generateGetNumberOfReviewsQuery(5, bookID);

  let reviewsStatus = await Books.findAll({
    where: {
      id: bookID,
    },
    attributes: [
      [q1, "numberOf1StarReviews"],
      [q2, "numberOf2StarReviews"],
      [q3, "numberOf3StarReviews"],
      [q4, "numberOf4StarReviews"],
      [q5, "numberOf5StarReviews"],
      [avgRatingsBookQuery, "ratings"],
    ],
  });

  // If the reviewsStatus is empty
  // We generate a default pattern for the client-site to behave normally
  if (reviewsStatus.length === 0) {
    reviewsStatus.push({
      book_id: bookID,
      numberOf1StarReviews: 0,
      numberOf2StarReviews: 0,
      numberOf3StarReviews: 0,
      numberOf4StarReviews: 0,
      numberOf5StarReviews: 0,
      ratings: "0",
    });
  }

  return reviewsStatus;
};

const getReviewsByBookID = async (req, res) => {
  const id = req.params.id;

  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query["page-size"]) || 15;
  const ratings = req.query["ratings"];
  const sortCriteria = req.query["sort"] || "datedesc";

  let ratingsWhere = ratings && ratings != "0" ? {
    rating_start: ratings
  } : {};

  const reviewList = await Reviews.findAndCountAll({
    include: [books],
    where: {
      book_id: id,
      ...ratingsWhere
    },
    order: [sortReviewsQuery(sortCriteria)],
  });

  const pageObject = paginate(reviewList.count, currentPage, pageSize);
  const finalreviewList = reviewList.rows.slice(
    pageObject.startIndex,
    pageObject.endIndex
  );
  const reviewsStatus = await getReviewsStatus(id);

  return res.status(200).json({
    reviews: {
      data: finalreviewList,
      total: pageObject.totalItems,
      current_page: pageObject.currentPage,
      per_page: pageObject.pageSize,
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

  return res.status(201).json(createdReview);
};

module.exports = {
  getReviewsByBookID,
  createReview,
};
