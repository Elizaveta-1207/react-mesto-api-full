import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const currentUser = React.useContext(CurrentUserContext);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      about: description,
    });
  }

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);

  return (
    <PopupWithForm name={"edit"} title={"Редактировать профиль"} buttonTitle={"Сохранить"} isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <input
        required
        name="name"
        type="text"
        placeholder="Введите имя"
        maxLength="40"
        minLength="2"
        className="popup__input popup__input_name"
        id="name-input"
        value={name || ""}
        onChange={handleNameChange}
      />
      <span id="name-input-error"></span>
      <input
        required
        name="description"
        type="text"
        placeholder="Введите описание"
        maxLength="200"
        minLength="2"
        className="popup__input popup__input_description"
        id="description-input"
        value={description || ""}
        onChange={handleDescriptionChange}
      />
      <span id="description-input-error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
