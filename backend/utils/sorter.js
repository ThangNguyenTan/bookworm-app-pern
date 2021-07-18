const sequelize = require("sequelize");
const { minDiscountPriceQueryCoalesce } = require("./queries");

const sortBooksQuery = (sortCriteria) => {
  let order = "";

  switch (sortCriteria) {
    case "popularity":
      order = sequelize.literal(
        `(SELECT COUNT(reviews.id) FROM reviews WHERE reviews.book_id = books.id) DESC`
      );
      break;
    case "onsale":
      order = sequelize.literal(
        `books.book_price - ${minDiscountPriceQueryCoalesce} DESC`
      );
      break;
    case "priceasc":
      order = sequelize.literal(`${minDiscountPriceQueryCoalesce} ASC`);
      break;
    case "pricedesc":
      order = sequelize.literal(`${minDiscountPriceQueryCoalesce} DESC`);
      break;
    default:
      break;
  }

  return order;
};

const sortReviewsQuery = (sortCriteria) => {
  let order = "";

  switch (sortCriteria) {
    case "dateasc":
      order = sequelize.literal(`review_date ASC`);
      break;
    case "datedesc":
      order = sequelize.literal(`review_date DESC`);
      break;
    default:
      break;
  }

  return order;
};

module.exports = {
  sortBooksQuery,
  sortReviewsQuery
};
