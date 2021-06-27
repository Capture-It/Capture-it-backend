"use strict";
const express = require("express");
const server = express();

const cors = require("cors");
const axios = require("axios");
server.use(cors());

require("dotenv").config();
server.use(express.json());


const PORT = process.env.PORT;



const{
  addPhoto,
    photoHandler,
    createUser,
    deletePhoto,
    addUserINDataBase,
    userPhotoToDB,
    getUserPhoto,
    deleteUserPhoto
    
}=require('./module/dbForHomeAndMyPhoto');

const{
  createPublishedUser,
  addPublishedDataToDB,
  getPublishedDataDB,
  addCommentToDB
}=require('./module/published');

// createPublishedUser();


////http://localhost:3010/deletephoto?email
server.delete('/deletephoto/:index', deletePhoto);

// http://localhost:3010/deleteUserphoto/${index}
server.delete('/deleteUserphoto/:index', deleteUserPhoto);




//http://localhost:3010/addphoto?
server.post('/addphoto', addPhoto);
// http://localhost:3010/initdb?
server.post('/initdb',addUserINDataBase);

//http://localhost:3010/getphoto?email=
server.get('/getphoto', photoHandler)

// http://localhost:3010/addUserPhoto
server.post('/addUserPhoto',userPhotoToDB)
// http://localhost:3010/getuserphoto?email=
server.get('/getuserphoto',getUserPhoto)

//the following routes for publisd data
// http://localhost:3010/addPublishedDataToDB?
server.post('/addPublishedDataToDB',addPublishedDataToDB);
// http://localhost:3010/getPublishedDataDB
server.get('/getPublishedDataDB',getPublishedDataDB);
// http://localhost:3010/addCommentToDB
server.post('/addCommentToDB',addCommentToDB);






//http://localhost:3010/
server.get("/", (req, res) => {
  res.send("Home Route");
});

function getRandomIntInclusive() {
  let min =1
  let max = 20
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//localhost:3010/photo?photoName=london
server.get("/photo", (req, res) => {
  let photo = req.query.photoName;
  let pageNumber=getRandomIntInclusive();
  let url = `https://api.unsplash.com/search/photos?page=${pageNumber}&query=${photo}&per_page=12&client_id=4u4HKTmiuGGTg3IPDuRj6BLWguZI-IvdfcHk2Uy6Tww`;
  axios.get(url).then((result) => {
    const photoArray = result.data.results.map((item) => {
      return new photo1(item);
    });

    res.send(photoArray);
  });
});

class photo1 {
  constructor(item) {
    this.imagel = item.urls.full;
    this.description = item.description;
    this.title = item.tags[1].title;
  }
}


server.listen(process.env.PORT || 3010, () => {
  console.log(`im here ${PORT}`);
});
