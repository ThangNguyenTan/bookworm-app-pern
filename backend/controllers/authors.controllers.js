const {authors, books} = require("../models");
const Authors = authors;

const getAllAuthors = async (req, res) => {
  const authorList = await Authors.findAll({
    attributes: ["id", "author_name"],
    include: [ books ],
    order: [
        ['id', 'ASC'],
    ],
  });

  return res.status(200).json(authorList);
};

module.exports = {
  getAllAuthors,
};
