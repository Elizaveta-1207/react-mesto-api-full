/* eslint-disable no-useless-escape */
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
4;
const uniqueValidator = require("mongoose-unique-validator");
const UnauthError = require("../errors/UnauthError");

const regex = /https?:\/\/([\/\w.-]+)/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    // required: true,
    validate: {
      validator(v) {
        return regex.test(v);
      },
      message: "Неверная ссылка!",
    },
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: "Неверный email!",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        // return Promise.reject(new Error("Неправильные почта или пароль"));
        throw new UnauthError("Неправильные почта или пароль");
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          // return Promise.reject(new Error("Неправильные почта или пароль"));
          throw new UnauthError("Неправильные почта или пароль");
        }

        return user;
      });
    });
};

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user", userSchema);
