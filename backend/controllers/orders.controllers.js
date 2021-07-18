const {orders, order_items} = require("../models");
const Orders = orders;

const getAllOrders = async (req, res) => {
  const orderList = await Orders.findAll({
    attributes: ["id", "order_date", "order_amount"],
    include: [ order_items ],
    order: [
        ['id', 'ASC'],
    ],
  });

  return res.status(200).json(orderList);
};

module.exports = {
    getAllOrders,
};
