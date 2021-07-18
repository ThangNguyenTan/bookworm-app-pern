const {books, authors, categories, discounts} = require("../models");
const Books = books;

const getAllBooks = async (req, res) => {
  const bookList = await Books.findAll({
    include: [ authors, categories, discounts ],
    order: [
        ['id', 'ASC'],
    ],
  });

  return res.status(200).json(bookList);
};

module.exports = {
    getAllBooks,
};
