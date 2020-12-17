/* eslint-disable import/prefer-default-export */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-underscore-dangle */

const handleOriginalResponse = (res) => {
  if (!res.ok) {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
  return res.json();
};

class Api {
  constructor(options) {
    this._token = options.baseUrl;
    this._authorization = options.headers.authorization;
    this._contentType = options.headers["Content-type"];
  }

  getInitialCards() {
    return fetch(`${this._token}/cards`, {
      method: "GET",
      headers: {
        authorization: this._authorization,
        "Content-type": `${this._contentType}`,
      },
    }).then(handleOriginalResponse);
  }

  addNewCard({ name, link }) {
    return fetch(`${this._token}/cards`, {
      method: "POST",
      headers: {
        authorization: this._authorization,
        "Content-Type": this._contentType,
      },
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(handleOriginalResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._token}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: this._authorization,
        "Content-Type": this._contentType,
      },
    }).then(handleOriginalResponse);
  }

  changeLikeCardStatus(cardId, isLiked) {
    return fetch(`${this._token}/cards/likes/${cardId}`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: {
        authorization: this._authorization,
        "Content-Type": this._contentType,
      },
    }).then(handleOriginalResponse);
  }

  getUserInfo() {
    return fetch(`${this._token}/users/me`, {
      method: "GET",
      headers: {
        authorization: this._authorization,
        "Content-type": `${this._contentType}`,
      },
    }).then(handleOriginalResponse);
  }

  editProfile({ name, about }) {
    return fetch(`${this._token}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: this._authorization,
        "Content-Type": this._contentType,
      },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(handleOriginalResponse);
  }

  editAvatar({ avatar }) {
    return fetch(`${this._token}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: this._authorization,
        "Content-Type": this._contentType,
      },
      body: JSON.stringify({
        avatar: `${avatar}`,
      }),
    }).then(handleOriginalResponse);
  }
}

// экземпляра класса Api
export const api = new Api({
  // baseUrl: "https://mesto.nomoreparties.co/v1/cohort-15",
  // baseUrl: "http://api.timonina.students.nomoredomains.monster",
  baseUrl: "http://localhost:3000",
  headers: {
    // authorization: "36046fe7-1e8e-4a22-8e60-7f2eb2d5b2d8",
    authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-type": "application/json",
  },
});
