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
  const author = req.query["author"];
  const category = req.query["category"];
  const ratings = req.query["ratings"];
  const sortCriteria = req.query["sort"] || "popularity";

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
    ...filterBooksQuery({
      author,
      category,
      ratings,
    }),
    order: [sortBooksQuery(sortCriteria)],
  });

  const pageObject = paginate(bookList.count, currentPage, pageSize);
  const finalBookList = bookList.rows.slice(
    pageObject.startIndex,
    pageObject.endIndex
  );

  return res.status(200).json({
    data: finalBookList,
    total: pageObject.totalItems,
    current_page: pageObject.currentPage,
    per_page: pageObject.pageSize,
  });
};

const getRecommendedBooks = async (req, res) => {
  const onSaleBooks = await Books.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(`${minDiscountPriceQueryCoalesce}`),
          "discount_price",
        ],
      ],
    },
    include: [{ model: authors, attributes: ["id", "author_name"] }],
    order: [sortBooksQuery("onsale")],
    limit: 10,
    offset: 0,
  });

  const popularBooks = await Books.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(`${minDiscountPriceQueryCoalesce}`),
          "discount_price",
        ],
      ],
    },
    include: [{ model: authors, attributes: ["id", "author_name"] }],
    order: [sortBooksQuery("popularity")],
    limit: 8,
    offset: 0,
  });

  const highlyRatedBooks = await Books.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(`${minDiscountPriceQueryCoalesce}`),
          "discount_price",
        ],
      ],
    },
    include: [{ model: authors, attributes: ["id", "author_name"] }],
    order: [sequelize.literal(`${avgRatingsBookQuery} DESC`)],
    limit: 8,
    offset: 0,
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
