const cardsRouter = require("express").Router();
const { celebrate, Joi, CelebrateError } = require("celebrate");
const validator = require("validator");

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

cardsRouter.get("/", getCards);
cardsRouter.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .custom((url) => {
          if (!validator.isURL(url)) {
            throw new CelebrateError("Неверный URL");
          }
          return url;
        }),
    }),
  }),
  createCard
);
cardsRouter.delete(
  "/:_id",
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().alphanum().length(24).hex(),
    }),
  }),
  deleteCard
);
cardsRouter.put("/:_id/likes", likeCard);
cardsRouter.delete("/:_id/likes", dislikeCard);

module.exports = cardsRouter;
