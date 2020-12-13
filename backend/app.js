const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;
const app = express();
const cardsRouter = require("./routes/cards");
const usersRouter = require("./routes/users");
const { login, createUser } = require("./controllers/users.js");
const auth = require("./middlewares/auth.js");
const NotFoundError = require("./errors/NotFoundError");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { errors, celebrate, Joi, CelebrateError } = require("celebrate");

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post("/signin", validateUser, login);
app.post("/signup", validateUser, createUser);

app.use(auth);

// app.use((req, res, next) => {
//   req.user = {
//     _id: "5fb7d9f994d7832efcd46d5f",
//   };
//   next();
// });

app.use("/cards", cardsRouter);
app.use("/users", usersRouter);
app.use("/*", (req, res) => {
  // res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
  throw new NotFoundError("Запрашиваемый ресурс не найден");
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
});

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
