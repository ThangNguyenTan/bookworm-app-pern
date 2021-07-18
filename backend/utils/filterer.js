const { sequelize } = require("../models");
const { avgRatingsBookQuery } = require("./queries");

const filterBooksQuery = (searchObject) => {
  let obj = {
    where: {}
  };

  const { author, category, ratings } = searchObject;

  if (author) {
    obj.where.author_id = author;
  }

  if (category) {
    obj.where.category_id = category;
  }

  if (ratings) {
    obj.where = sequelize.literal(`${avgRatingsBookQuery} >= ${ratings}`);
}

  return obj;
};

module.exports = {
    filterBooksQuery,
};
