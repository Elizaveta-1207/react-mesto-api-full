import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name,
      link,
    });
  }

  return (
    <PopupWithForm
      name={"add"}
      title={"Новое место"}
      buttonTitle={"Создать"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        required
        name="name"
        type="text"
        placeholder="Название"
        maxLength="30"
        minLength="1"
        className="popup__input popup__input_title"
        id="title-input"
        value={name || ""}
        onChange={handleNameChange}
      />
      <span id="title-input-error"></span>
      <input
        required
        name="link"
        type="url"
        placeholder="Ссылка на картинку"
        className="popup__input popup__input_link"
        id="link-input-add"
        value={link || ""}
        onChange={handleLinkChange}
      />
      <span id="link-input-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
