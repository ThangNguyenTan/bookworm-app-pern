const {categories} = require("../models");
const Categories = categories;

const getAllCategories = async (req, res) => {
  const categoryList = await Categories.findAll({
    attributes: ["id", "category_name"],
    order: [
        ['id', 'ASC'],
    ],
  });

  return res.status(200).json(categoryList);
};

module.exports = {
    getAllCategories,
};
