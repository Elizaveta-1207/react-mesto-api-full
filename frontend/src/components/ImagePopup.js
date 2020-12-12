import React from "react";

function ImagePopup({
  link, title, isOpen, onClose,
}) {
  return (
    <div className={`popup popup-img ${isOpen && "popup_opened"}`} id="popup-image">
      <div className="popup__img-container">
        <button aria-label="Закрыть картинку" type="button" className="popup__close-button" onClick={onClose}></button>
        <img src={link} alt={title} className="popup__full-img" />
        <h2 className="popup__title-img">{title}</h2>
      </div>
    </div>
  );
}

export default ImagePopup;
