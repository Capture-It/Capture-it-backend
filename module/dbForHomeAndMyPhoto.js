"use strict";

module.exports = {
  addPhoto,
  photoHandler,
  createUser,
  deletePhoto,
  addUserINDataBase,
};
let keyAtlas = process.env.ATLAS;
const mongoose = require("mongoose");

mongoose.connect(keyAtlas, { useNewUrlParser: true, useUnifiedTopology: true });

const photoSchema = mongoose.Schema({
  title: String,
  description: String,
  url: String,
});

const usrSchema = mongoose.Schema({
  email: String,
  photo: [photoSchema],
});

const photoModel = mongoose.model("photo", photoSchema);
const userModel = mongoose.model("user", usrSchema);

function createUser(email) {
  const user = [];
  user.push(
    new userModel({
      email: email,
      photo: [{}],
    })
  );
  user[0].save();
}

// createUser();

//this methode to store the picture that choosen by the user in the database
//http://localhost:3010/addphoto?
function addPhoto(req, res) {
  let { title, des, imgUrl, email } = req.body;

  userModel.find({ email: email }, function (err, photoData) {
    if (err) {
      res.send(err);
    } else {
      photoData[0].photo.push({
        title,
        description: des,
        url: imgUrl,
      });
      photoData[0].save();
      res.send(photoData[0].photo);
    }
  });
}
//this function to insert new user in database
function addUserINDataBase(req, res) {
  let { email } = req.body;
  console.log(req.body);

  userModel.find({ email: email }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data.length === 0) {
        createUser(email);
        console.log("created");
      } else {
        console.log(data);
      }
    }
  });
}

//this methode to return photo in my photo component
//http://localhost:3010/getphoto?email=
function photoHandler(req, res) {
  let email = req.query.email;
  // console.log(email);

  userModel.find({ email: email }, function (err, photoData) {
    if (err) {
      res.send(err);
    } else {
      res.send(photoData[0].photo);
    }
  });
}

//DeleteFunction

function deletePhoto(req, res) {
  console.log("🚀 ~ file: server.js ~ line 136 ~ deletePhoto ~ query");
  const { email } = req.query;
  const index = Number(req.params.index); //1
  console.log("🚀 ~ file: server.js ~ line 139 ~ deletePhoto ~ index", index);

  console.log(email);

  userModel.find({ email: email }, (err, data) => {
    console.log("before", data);
    if (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    } else {
      const newPhotoArray = data[0].photo.filter((item, idx) => {
        if (index !== idx) {
          return item;
        }
      });
      data[0].photo = newPhotoArray;
      data[0].save();
      console.log("after", data);

      res.status(201).send(data[0].photo);
    }
  });
}
