const { orders, order_items, books, authors } = require("../models");
const { validateOrderItems } = require("../validations/orders.validations");
const { StatusCodes } = require("http-status-codes");
const Orders = orders;

const getAllOrders = async (req, res) => {
  const orderList = await Orders.findAll({
    attributes: ["id", "order_date", "order_amount"],
    include: [
      {model: order_items, attributes: ['id']}
    ],
    order: [["id", "ASC"]],
  });

  return res.status(StatusCodes.OK).json(orderList);
};

const createOrder = async (req, res) => {
  const { order_amount } = req.body;
  const orderItems = req.body.order_items;

  const invalidBookID = await validateOrderItems(orderItems);

  if (invalidBookID) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `The product with an ID of ${invalidBookID} does not exist`,
      invalidBookID,
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

  return res.status(StatusCodes.CREATED).json(createdOrder);
};

const getOrderByID = async (req, res) => {
  const id = req.params.id;

  // These variables are for nested relationship fetching
  // In order to get enough data for an order details to display
  // Including: books, author, order items and order details.
  const includeAuthor = [
    {
      model: authors,
      attributes: ["id", "author_name"],
    },
  ];
  const includeBook = [
    {
      model: books,
      attributes: ["id", "book_title", "book_cover_photo"],
      include: includeAuthor,
    },
  ];
  const includeOrderItems = [
    {
      model: order_items,
      attributes: ["id", "quantity", "price"],
      include: includeBook,
    },
  ];

  const order = await Orders.findOne({
    where: {
      id,
    },
    attributes: ["id", "order_date", "order_amount"],
    include: includeOrderItems,
  });

  if (!order) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "There is no record with this ID"
    });
  }

  return res.status(StatusCodes.OK).json(order);
};

module.exports = {
  getAllOrders,
  createOrder,
  getOrderByID,
};
