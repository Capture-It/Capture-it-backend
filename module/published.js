"use strict";

module.exports = {
    createPublishedUser,
    addPublishedDataToDB,
    getPublishedDataDB,
    addCommentToDB

};

// let keyAtlas = process.env.ATLAS;
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/photos', { useNewUrlParser: true, useUnifiedTopology: true });

const publishedDataSchema = mongoose.Schema({
  name:String,
  title: String,
  description: String,
  url: String,
  comment:[]
});

const publishedUserSchema = mongoose.Schema({
  email: String,
  userPublishedData:[publishedDataSchema]

});

const publishedDataSchemaModel = mongoose.model("publishedPhoto", publishedDataSchema);
const publishedUserSchemaModel = mongoose.model("PublishedUserData", publishedUserSchema);

function createPublishedUser(email,title,description,url,nickName) {
  // const user = [];
  // user.push(
  //   new publishedUserSchemaModel({
  //     email: email,
  //     userPublishedData:[{
  //       name:nickName,
  //       title: title,
  //       description: description,
  //       url: url,
  //     }]
  //   })
  // );
  // user[0].save();
  
  const user1=publishedUserSchemaModel({
      email:'abdullah@yahoo.com',
      userPublishedData:[
          {
        name:"String",
        title: "String",
        description: "String",
        url: "String",
        comment:[
            {
                text:'cool'
            }
                
        ]
          }

      ]

  })
  user1.save();
}

// createPublishedUser();

// http://localhost:3010/addPublishedDataToDB?

function addPublishedDataToDB(req, res) {
    let { title, description, url, email,nickName } = req.body;
  
    publishedUserSchemaModel.find({ email: email }, function (err, photoData) {
      if (err) {
        res.send(err);
      } else {
          if(photoData.length!==0){
        photoData[0].userPublishedData.push({
          title,
          description: description,
          url: url,
          name:nickName,
          comment:[]
        });
        photoData[0].save();
        // res.send(photoData[0].userPublishedData);
        console.log('added');
    }
          else{
            createPublishedUser(email,title,description,url,nickName);

          }
      }
    });
  }



  // http://localhost:3010/getPublishedDataDB

  function getPublishedDataDB(req, res) {
    publishedUserSchemaModel.find({}, function (err, photoData) {
      if (err) {
        res.send(err);
      } else {
        res.send(photoData);
        // console.log(photoData);
      }
    });

    }

// http://localhost:3010/addCommentToDB
    function addCommentToDB(req, res) {
        let { email, comment, name, pic,id } = req.body;
        console.log(req.body);
      
        publishedUserSchemaModel.find({ email: email }, function (err, photoData) {
          if (err) {
            res.send(err);
          } else {
            let newArr= photoData[0].userPublishedData.filter((item)=>{
                 if(id==item._id){
                     return item;
                 }else{
                     console.log('no');
                 }
                })
                newArr[0].comment.push({
                   text:comment,
                   commenter: name ,
                   url: pic,
                 });

                console.log(photoData[0].userPublishedData);
                photoData[0].save();
                // res.send(photoData[0].userPublishedData);
                // console.log('added');
        }
    });
}

