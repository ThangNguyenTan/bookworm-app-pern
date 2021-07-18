const express = require("express");
const router = express.Router();
const expressAsyncHandler = require("express-async-handler");
const {
  getAllOrders,
  createOrder,
} = require("../controllers/orders.controllers");
const { createOrderValidation } = require("../validations/orders.validations");

router.get("/", expressAsyncHandler(getAllOrders));

router.post("/", createOrderValidation, expressAsyncHandler(createOrder));

module.exports = router;
