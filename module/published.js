"use strict";

module.exports = {
  createPublishedUser,
  addPublishedDataToDB,
  getPublishedDataDB,
  addCommentToDB,
  deletePublishedphoto,
};

// let keyAtlas = process.env.ATLAS;
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/photos', { useNewUrlParser: true, useUnifiedTopology: true });

const publishedDataSchema = mongoose.Schema({
  name: String,
  title: String,
  description: String,
  url: String,
  comment: [],
});

const publishedUserSchema = mongoose.Schema({
  email: String,
  userPublishedData: [publishedDataSchema],
});

const publishedDataSchemaModel = mongoose.model(
  "publishedPhoto",
  publishedDataSchema
);
const publishedUserSchemaModel = mongoose.model(
  "PublishedUserData",
  publishedUserSchema
);

<<<<<<< HEAD
function createPublishedUser(email, title, description, url, nickName) {
  const user = [];
  user.push(
    new publishedUserSchemaModel({
      email: email,
      userPublishedData: [
        {
          name: nickName,
          title: title,
          description: description,
          url: url,
        },
      ],
    })
  );
  user[0].save();

  //   const user1=publishedUserSchemaModel({
  //       email:'abdullah@yahoo.com',
  //       userPublishedData:[
  //           {
  //         name:"String",
  //         title: "String",
  //         description: "String",
  //         url: "String",
  //         comment:[
  //             {
  //                 text:'cool'
  //             }

  //         ]
  //           }

  //       ]

  //   })
  //   user1.save();
=======
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
>>>>>>> origin/work_1
}

// createPublishedUser();

// http://localhost:3010/addPublishedDataToDB?

function addPublishedDataToDB(req, res) {
  let { title, description, url, email, nickName } = req.body;

  publishedUserSchemaModel.find({ email: email }, function (err, photoData) {
    if (err) {
      res.send(err);
    } else {
      if (photoData.length !== 0) {
        photoData[0].userPublishedData.push({
          title,
          description: description,
          url: url,
          name: nickName,
          comment: [],
        });
        console.log("added");
        photoData[0].save();
      } else {
        console.log("create new photo");
        createPublishedUser(email, title, description, url, nickName);
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
    }
  });
}

//  function  getPublishedDataDB1 () {
//   publishedUserSchemaModel.find({}, function (err, photoData) {

//     console.log('hhhhh',photoData);
//     return(photoData);

// });

//   }

// http://localhost:3010/addCommentToDB
 function addCommentToDB(req, res) {
  let { email, comment, name, pic, id } = req.body;
  console.log(req.body);

   publishedUserSchemaModel.find({ email: email }, function (err, photoData) {
    if (err) {
      res.send(err);
    } else {
      console.log(photoData[0].userPublishedData.length);
      // userData.page[0].recipes.length
      for (
        let index = 0;
        index < photoData[0].userPublishedData.length;
        index++
      ) {
        if (id === photoData[0].userPublishedData[index]._id.toString()) {
          photoData[0].userPublishedData[index].comment.push({
            text: comment,
            commenter: name,
            url: pic,
          });
          photoData[0].save().then((result)=>{
            publishedUserSchemaModel.find({}, function (err, photoData) {
              if(err){
                res.send('something went wrong')
              }else{
              console.log('hhhhh',photoData);
              res.send(photoData)
              }
            });
          });
          break;
        }
        console.log(index);
      }
    }
    
    
    
    // res.send(photoData[0]);
  });
 
}

function deletePublishedphoto(req, res) {
  const { email,url } = req.query;
  // const url = req.params.url;
  console.log(email);
  console.log("from the front", url);

  publishedUserSchemaModel.find({ email: email }, function (err, photoData) {
    if (err) {
      res.send(err);
    } else {
      let newArr = photoData[0].userPublishedData.filter((item) => {
        console.log(item.url);
        if (url !== item.url) {
          return item;
        } else {
          console.log("no");
        }
      });
      photoData[0].userPublishedData = [];
      photoData[0].userPublishedData =
        photoData[0].userPublishedData.concat(newArr);
      console.log(photoData[0].userPublishedData);
      console.log(photoData[0]);
      photoData[0].save();
    }
  });
}
