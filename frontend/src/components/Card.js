import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({
  _id,
  link,
  name,
  likes,
  owner,
  onCardClick,
  onCardLike,
  onCardDelete,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  const card = {
    _id,
    link,
    name,
    owner,
    likes,
  };
  const isOwn = card.owner === currentUser._id;

  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  const cardDeleteButtonClassName = `element__delete ${
    isOwn ? "" : "element__delete_hidden"
  }`;
  const cardLikeButtonClassName = `element__like ${
    isLiked ? "element__like_active" : ""
  }`;

  function handleClick() {
    onCardClick({
      link,
      name,
    });
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="element">
      <button
        aria-label="Удалить"
        type="button"
        className={cardDeleteButtonClassName}
        onClick={handleDeleteClick}
      ></button>
      <img
        src={link}
        alt={name}
        className="element__img"
        onClick={handleClick}
      />
      <div className="element__description">
        <h2 className="element__title">{name}</h2>
        <div className="element__likes">
          <button
            aria-label="Лайк"
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          ></button>
          <p className="element__like-amount">{likes.length}</p>
        </div>
      </div>
    </li>
  );
}

export default Card;
