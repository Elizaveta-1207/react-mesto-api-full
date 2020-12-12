import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatarRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name={"avatar"}
      title={"Обновить аватар"}
      buttonTitle={"Сохранить"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        required
        name="link"
        type="url"
        placeholder="Ссылка на картинку"
        className="popup__input popup__input_link"
        id="link-input-edit"
        ref={avatarRef}
      />
      <span id="link-input-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
