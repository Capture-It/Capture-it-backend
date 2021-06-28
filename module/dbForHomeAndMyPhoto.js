"use strict";

module.exports = {
  addPhoto,
  photoHandler,
  createUser,
  deletePhoto,
  addUserINDataBase,
  userPhotoToDB,
  getUserPhoto,
  deleteUserPhoto,
  updateuserPhotoHandler
};
// let keyAtlas = process.env.ATLAS;
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/photos', { useNewUrlParser: true, useUnifiedTopology: true });

const photoSchema = mongoose.Schema({
  title: String,
  description: String,
  url: String,
});

const usrSchema = mongoose.Schema({
  email: String,
  photo: [photoSchema],
  userphotos:[photoSchema]

});

const photoModel = mongoose.model("photo", photoSchema);
const userPhotoModel = mongoose.model("userphotos", photoSchema);
const userModel = mongoose.model("user", usrSchema);

function createUser(email) {
  const user = [];
  user.push(
    new userModel({
      email: email,
      photo: [{}],
      userphotos: [{}],
    })
   );
  user[0].save();
//  const user1=userModel({
//     email: "123@gmail.com",
//     photo:[
//     {title:"String",
//     description :"String",
//     url:"String", }],
//     userphotos:[{
//     title:"String",
//     description :"String",
//     url:"String",} ],
// })
//   user1.save();
  // user1=newModel({
  //   email:'abodeian28@gmail',
  //   photo:[
  //     title: "String",
  // description: "String",
  // url: "String",
  //   ]
  // })
  // user1.save;
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
//this function to store the photo that enterd in the form by the user
function userPhotoToDB(req, res) {
  let { title, description, imgurl, email } = req.body;
  console.log(req.body);
  
  userModel.find({ email: email }, function (err, photoData) {
    console.log("userphoto");
    if (err) {
      res.send(err);
    } else {
      photoData[0].userphotos.push({
        title,
        description: description,
        url: imgurl,
      });
      photoData[0].save();
      res.send(photoData[0].photo);
    }
  });
}
//this function to insert new user in database
function addUserINDataBase(req, res) {
  let { email } = req.body;

  
  userModel.find({ email: email }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data.length === 0) {
        createUser(email);
        console.log("created");
      } else {
        // console.log(data);
      }
    }
  });
}

//this methode to return photo in my photo component
//http://localhost:3010/getphoto?email=
function photoHandler(req, res) {
  let email = req.query.email;

  userModel.find({ email: email }, function (err, photoData) {
    if (err) {
      res.send(err);
    } else {
      res.send(photoData[0].photo);
    }
  });
}

//this function to return the photos that added by the user
//http://localhost:3010/getuserphoto?email=
function getUserPhoto(req, res) {
  let email = req.query.email;
  userModel.find({ email: email }, function (err, photoData) {
    if (err) {
      res.send(err);
    } else {
      res.send(photoData[0].userphotos);
    }
  });
}

//this function to delete the selected photo(add to my photo)
//DeleteFunction
function deletePhoto(req, res) {
  const { email } = req.query;
  const index = Number(req.params.index); //1

  userModel.find({ email: email }, (err, data) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      const newPhotoArray = data[0].photo.filter((item, idx) => {
        if (index !== idx) {
          return item;
        }
      });
      data[0].photo = newPhotoArray;
      data[0].save();

      res.status(201).send(data[0].photo);
    }
  });
}
function deleteUserPhoto(req, res) {
  const { email } = req.query;
  const index = Number(req.params.index); //1

  userModel.find({ email: email }, (err, data) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      const newPhotoArray = data[0].userphotos.filter((item, idx) => {
        if (index !== idx) {
          return item;
        }
      });
      data[0].userphotos = newPhotoArray;
      data[0].save();

      res.status(201).send(data[0].photo);
    }
  });
}


//http://localhost:3010/updatePhoto
function updateuserPhotoHandler(req,res){
const index=req.params.index;
const {email,photoName,description,imgurl}=req.body;
console.log(req.body)
console.log(index,email,photoName,description)
userModel.findOne({email:email}, (err,ownerData)=>{
  ownerData.userphotos.splice(index,1,{
    url:imgurl,
    title:photoName,
    description:description,
  })
  // console.log(ownerData)
    ownerData.save();
    res.send(ownerData.userphotos)
  
})


}


// let newArr =ownerData.userphotos.splice(index,1,{
//   title:photoName,
//   description:description
// })
// ownerData.userphotos=newArr
// ownerData.save();
// res.send(ownerData.userphotos)


