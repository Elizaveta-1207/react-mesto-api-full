/* eslint-disable function-paren-newline */
/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() =>
      res.status(500).send({ message: "Запрашиваемый ресурс не найден" })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Ошибка валидации. Введены некорректные данные" });
        return;
      }
      res.status(500).send({ message: "Запрашиваемый ресурс не найден" });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params._id)
    .select("+owner")
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        // throw new ForbiddenError("Нельзя удалить чужую карточку!");
        return Promise.reject(new Error("Нельзя удалить чужую карточку!"));
      }
    })
    .then(() => {
      Card.findByIdAndRemove(req.params._id)
        .then((card) => {
          if (!card) {
            // throw new NotFoundError("Запрашиваемый ресурс не найден");
            return Promise.reject(new Error("Запрашиваемый ресурс не найден"));
          }
          res.send(card);
        })
        .catch(next);
    })
    .catch(next);
  // Card.findByIdAndRemove(req.params._id)
  //   .orFail(() => {
  //     const error = new Error("CastError");
  //     error.statusCode = 404;
  //     throw error;
  //   })
  //   .then((card) => res.send(card))
  //   .catch((err) => {
  //     if (err.name === "CastError") {
  //       res
  //         .status(404)
  //         .send({ message: "Ошибка удаления карточки c таким id" });
  //       return;
  //     }
  //     res.status(500).send({ message: "Запрашиваемый ресурс не найден" });
  //   });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("CastError");
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      console.log(err);
      if (err.statusCode === 404) {
        res.status(404).send({
          message:
            "Карточки с таким id не существует, невозможно проставить лайк",
        });
        return;
      }
      res.status(500).send({ message: "Запрашиваемый ресурс не найден" });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("CastError");
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      console.log(err.name);
      console.log(12345);
      if (err.statusCode === 404) {
        res.status(404).send({
          message: "Карточки с таким id не существует, невозможно забрать лайк",
        });
        return;
      }
      res.status(500).send({ message: "Запрашиваемый ресурс не найден" });
    });
};
