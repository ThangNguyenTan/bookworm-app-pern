const { books, authors } = require("../models");
const { filterBooksQuery } = require("../utils/filterer");
const { paginate } = require("../utils/pagination");
const { sortBooksQuery } = require("../utils/sorter");
const sequelize = require("sequelize");
const {
  minDiscountPriceQueryCoalesce,
  avgRatingsBookQuery,
} = require("../utils/queries");
const Books = books;

const getAllBooks = async (req, res) => {
  // Query: page, page-size, author, category, ratings, sort
  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query["page-size"]) || 15;
  const sortCriteria = req.query.sort || "popularity";
  const { author, category, ratings } = req.query;

  // Generate where and order clause for filtering and sorting
  const whereClause = filterBooksQuery({
    author,
    category,
    ratings,
  });
  const orderClause = [sortBooksQuery(sortCriteria)];

  const bookList = await Books.findAndCountAll({
    attributes: {
      include: [
        [
          sequelize.literal(`${minDiscountPriceQueryCoalesce}`),
          "discount_price",
        ],
      ],
    },
    include: [{ model: authors, attributes: ["id", "author_name"] }],
    where: whereClause,
    order: orderClause,
  });

  // Create pagination object and slice the list respondingly
  const pageObject = paginate(bookList.count, currentPage, pageSize);
  const finalBookList = bookList.rows.slice(
    pageObject.startIndex,
    pageObject.endIndex
  );

  return res.status(200).json({
    data: finalBookList,
    total: pageObject.totalItems,
    currentPage: pageObject.currentPage,
    perPage: pageObject.pageSize,
  });
};

const getRecommendedBooks = async (req, res) => {
  // Create generic fetch object for all of the list
  // Default value is for fetching highlyRatedBooks
  let fetchObject = {
    attributes: {
      include: [
        [
          sequelize.literal(`${minDiscountPriceQueryCoalesce}`),
          "discount_price",
        ],
      ],
    },
    include: [{ model: authors, attributes: ["id", "author_name"] }],
    order: [
      sequelize.literal(`${avgRatingsBookQuery} DESC`),
      sequelize.literal(`${minDiscountPriceQueryCoalesce} ASC`),
    ],
    limit: 8,
    offset: 0,
  };

  // Filter the books by on sale
  // i.e. the difference between book price and discount price.
  // The higher the difference the higher the rankings
  const onSaleBooks = await Books.findAll({
    ...fetchObject,
    order: [sortBooksQuery("onsale")],
    limit: 10,
  });

  // Filter the books by popularity
  // i.e. number of reviews.
  // The more the reviews the higher the rankings
  const popularBooks = await Books.findAll({
    ...fetchObject,
    order: [
      sortBooksQuery("popularity"),
      sequelize.literal(`${minDiscountPriceQueryCoalesce} ASC`),
    ],
    limit: 8,
  });

  // Filter the books by average ratings
  // The higher the ratings the higher the rankings
  const highlyRatedBooks = await Books.findAll({
    ...fetchObject,
  });

  return res.status(200).json({
    onSaleBooks,
    highlyRatedBooks,
    popularBooks,
  });
};

const getBookByID = async (req, res) => {
  const id = req.params.id;

  const book = await Books.findOne({
    where: {
      id,
    },
    attributes: {
      include: [
        [
          sequelize.literal(`${minDiscountPriceQueryCoalesce}`),
          "discount_price",
        ],
      ],
    },
    include: [{ model: authors, attributes: ["id", "author_name"] }],
  });

  return res.status(200).json(book);
};

module.exports = {
  getAllBooks,
  getRecommendedBooks,
  getBookByID,
};
