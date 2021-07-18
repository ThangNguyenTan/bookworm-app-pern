const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { syncBD } = require("./config/syncDB");
const cors = require("cors");

const indexRouter = require("./routes/index");
const authorsRouter = require("./routes/authors");
const categoriesRouter = require("./routes/categories");
const booksRouter = require("./routes/books");
const ordersRouter = require("./routes/orders");

syncBD();

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/books", booksRouter);
app.use("/api/orders", ordersRouter);

// Error Handlers
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

module.exports = app;
