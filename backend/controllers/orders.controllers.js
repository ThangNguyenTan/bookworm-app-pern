const { orders, order_items, books, authors } = require("../models");
const { validateOrderItems } = require("../validations/orders.validations");
const Orders = orders;

const getAllOrders = async (req, res) => {
  const orderList = await Orders.findAll({
    attributes: ["id", "order_date", "order_amount"],
    order: [["id", "ASC"]],
  });

  return res.status(200).json(orderList);
};

const createOrder = async (req, res) => {
  const { order_amount } = req.body;
  const orderItems = req.body.order_items;

  const invalidBookID = await validateOrderItems(orderItems);

  if (invalidBookID) {
    return res.status(400).json({
      message: `The product with an ID of ${invalidBookID} does not exist`,
      invalid_book_id: invalidBookID,
    });
  }

  const createdOrder = await orders.create({
    order_amount,
  });

  for (let i = 0; i < orderItems.length; i++) {
    const orderItem = orderItems[i];

    await order_items.create({
      orderId: createdOrder.id,
      bookId: orderItem.bookId,
      quantity: orderItem.quantity,
      price: orderItem.price,
    });
  }

  return res.status(201).json(createdOrder);
};

const getOrderByID = async (req, res) => {
  const id = req.params.id;

  const orderList = await Orders.findOne({
    where: {
      id,
    },
    attributes: ["id", "order_date", "order_amount"],
    include: [
      {
        model: order_items,
        attributes: ["id", "quantity", "price"],
        include: [
          {
            model: books,
            attributes: ["id", "book_title", "book_cover_photo"],
            include: [
              {
                model: authors,
                attributes: ["id", "author_name"],
              },
            ],
          },
        ],
      },
    ],
  });

  return res.status(200).json(orderList);
};

module.exports = {
  getAllOrders,
  createOrder,
  getOrderByID
};
