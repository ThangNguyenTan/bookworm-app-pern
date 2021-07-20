const { authors } = require("../models");
const Authors = authors;
const { StatusCodes } = require("http-status-codes");

const getAllAuthors = async (req, res) => {
  const authorList = await Authors.findAll({
    attributes: ["id", "author_name"],
    order: [["author_name", "ASC"]],
  });

  return res.status(StatusCodes.OK).json(authorList);
};

module.exports = {
  getAllAuthors,
};
