const usersRouter = require("express").Router();

const {
  getUsers,
  getUser,
  // createUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

usersRouter.get("/", getUsers);
usersRouter.get("/me", getUser);
usersRouter.get("/:_id", getUserById);

// usersRouter.get("/:_id", getUser);
// usersRouter.post("/", createUser);
usersRouter.patch("/me", updateUser);
usersRouter.patch("/me/avatar", updateAvatar);

module.exports = usersRouter;
