/* eslint-disable object-curly-newline */
import React from "react";

function PopupWithForm({ name, title, buttonTitle, children, isOpen, onClose, onSubmit }) {
  return (
    <div className={`popup popup-${name} ${isOpen && "popup_opened"}`}>
      <div className="popup__container">
        <button
          aria-label="Закрыть"
          type="button"
          className="popup__close-button"
          onClick={onClose}
        ></button>
        <h2 className="popup__title">{title}</h2>
        <form
          action="#"
          name="popup-form"
          className={`popup__form popup-${name}__form`}
          onSubmit={onSubmit}
          noValidate
        >
          {children}
          <button type="submit" className="popup__button">
            {buttonTitle}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
