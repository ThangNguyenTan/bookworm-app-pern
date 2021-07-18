const express = require("express");
const router = express.Router();
const expressAsyncHandler = require("express-async-handler");
const { getAllOrders } = require("../controllers/orders.controllers");

router.get("/", expressAsyncHandler(getAllOrders));

module.exports = router;
