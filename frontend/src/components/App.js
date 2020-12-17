/* eslint-disable object-curly-newline */
import React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import "../index.css";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import { api } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import successLogo from "../images/success.png";
import failLogo from "../images/failure.png";
import * as auth from "../utils/auth";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(
    false
  );
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(
    false
  );
  const [selectedCard, setSelectedCard] = React.useState({ isOpen: false });
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  /* new states and constans */
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [dataInfoTool, setDataInfoTool] = React.useState({
    title: "",
    icon: "",
  });
  const [userData, setUserData] = React.useState("");
  const history = useHistory();

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleInfoTooltipOpen() {
    setIsInfoTooltipOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard({
      isOpen: true,
      link: card.link,
      title: card.name,
    });
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({ isOpen: false });
    setIsInfoTooltipOpen(false);
  }

  function handleUpdateUser({ name, about }) {
    api
      .editProfile({ name, about })
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error ${err}`));
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .editAvatar({ avatar })
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error ${err}`));
  }

  function handleCardLike(card) {
    // Проверяем, есть ли лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));

        // Обновляем стейт
        setCards(newCards);
      })
      .catch((err) => console.log(`Error ${err}`));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        // Обновляем стейт
        setCards(newCards);
      })
      .catch((err) => console.log(`Error ${err}`));
  }

  function setupCards(cards) {
    setCards(
      cards.map((item) => ({
        _id: item._id,
        link: item.link,
        name: item.name,
        owner: item.owner,
        likes: item.likes,
      }))
    );
  }

  function handleAddPlaceSubmit({ name, link }) {
    api
      .addNewCard({ name, link })
      .then((newCard) => {
        setCards([...cards, newCard]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error ${err}`));
  }

  React.useEffect(() => {
    if (loggedIn) {
      const promises = [api.getUserInfo(), api.getInitialCards()];

      Promise.all(promises)
        .then((results) => {
          setCurrentUser(results[0]);
          setupCards(results[1]);
        })
        .catch((err) => console.log(`Error ${err}`));
    }
  }, [loggedIn]);

  function handleRegister(email, password) {
    auth
      .register(email, password)
      .then((data) => {
        history.push("/sign-in");
        console.log(data);
        setDataInfoTool({
          title: "Вы успешно зарегистрировались!",
          icon: successLogo,
        });
        handleInfoTooltipOpen();
      })
      .catch((err) => {
        console.error(err);
        setDataInfoTool({
          title: "Что-то пошло не так! Попробуйте ещё раз.",
          icon: failLogo,
        });
        handleInfoTooltipOpen();
      });
  }

  function handleLogin(email, password) {
    console.log(email, password);
    auth
      .authorize(email, password)
      .then((data) => {
        //------------------------------------
        // auth
        //   .getContent(data.token)
        //   .then((res) => {
        //     // console.log(res);
        //     // setUserData(res.data.email);
        //     setUserData(res.email);
        //   })
        //   .catch((err) => {
        //     setDataInfoTool({
        //       title: "Что-то пошло не так! Попробуйте ещё раз.",
        //       icon: failLogo,
        //     });
        //     console.error(err);
        //     handleInfoTooltipOpen();
        //   });
        //------------------------------------
        console.log(data.token);
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
        history.push("/");
      })
      .catch((err) => {
        setDataInfoTool({
          title: "Что-то пошло не так! Попробуйте ещё раз.",
          icon: failLogo,
        });
        console.error(err);
        handleInfoTooltipOpen();
      });
  }

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (loggedIn) {
      auth
        .getContent(token)
        .then((res) => {
          // console.log(res);
          // setUserData(res.data.email);
          setUserData(res.email);
          setLoggedIn(true);
        })
        .catch((err) => {
          setDataInfoTool({
            title: "Что-то пошло не так! Попробуйте ещё раз.",
            icon: failLogo,
          });
          console.error(err);
          handleInfoTooltipOpen();
        });
    }
  }, [loggedIn]);

  function tokenCheck() {
    const token = localStorage.getItem("token");
    if (token) {
      auth
        .getContent(token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            // setUserData(res.data.email);
            setUserData(res.email);
            history.push("/");
          } else {
            setDataInfoTool({
              title: "Что-то пошло не так! Попробуйте ещё раз.",
              icon: failLogo,
            });
            handleInfoTooltipOpen();
          }
        })
        .catch((err) => console.log(err));
    }
  }

  React.useEffect(() => {
    tokenCheck();
  }, []);

  function signOut() {
    setLoggedIn(false);
    setUserData("");
    localStorage.removeItem("token");
    history.push("/sign-in");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header headerMail={userData} signOut={signOut} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            loggedIn={loggedIn}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
          <Route path="/sign-up">
            <Register handleRegister={handleRegister} />
          </Route>
          <Route path="/sign-in">
            <Login handleLogin={handleLogin} />
          </Route>
          <Route exact path="/">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <PopupWithForm
          name={"confirm"}
          title={"Вы уверены?"}
          buttonTitle={"Да"}
          onClose={closeAllPopups}
        ></PopupWithForm>

        <ImagePopup
          link={selectedCard.link}
          title={selectedCard.title}
          isOpen={selectedCard.isOpen}
          onClose={closeAllPopups}
        />

        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          title={dataInfoTool.title}
          icon={dataInfoTool.icon}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
