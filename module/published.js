"use strict";

module.exports = {
    createPublishedUser,
    addPublishedDataToDB,
    getPublishedDataDB,
    addCommentToDB,
    deletePublishedphoto
};

let keyAtlas = process.env.ATLAS;
const mongoose = require("mongoose");

mongoose.connect(keyAtlas, { useNewUrlParser: true, useUnifiedTopology: true });

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
  const user = [];
  user.push(
    new publishedUserSchemaModel({
      email: email,
      userPublishedData:[{
        name:nickName,
        title: title,
        description: description,
        url: url,
      }]
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
        console.log('added');
        photoData[0].save();
        // res.send(photoData[0].userPublishedData);
    }
          else{
            console.log('create new photo');
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
  
    //  function  getPublishedDataDB1 () {
      //   publishedUserSchemaModel.find({}, function (err, photoData) {
        
    //       console.log('hhhhh',photoData);
    //       return(photoData);
    
    //   });
    
    //   }
    
    // http://localhost:3010/addCommentToDB
    function addCommentToDB (req, res) {
        let { email, comment, name, pic,id } = req.body;
        console.log(req.body);
      
        publishedUserSchemaModel.find({ email: email },  function (err, photoData) {
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
                 photoData[0].save();
                 
                // try{
                  //   publishedUserSchemaModel.find({}, function (err, photoData1) {
                //     res.send(photoData1);
                
                // });
                // }
                // catch(err){
                  //   console.log(err);
                // }
              }
            });
}

// http://localhost:3010/deletePublishedphoto/
function deletePublishedphoto(req, res) {
  const { email } = req.query;
  const id = req.params.id;
  console.log((email));
  console.log(id);

  publishedUserSchemaModel.find({ email: email }, (err, data) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      const newPhotoArray = data[0].userPublishedData.filter((item) => {
        if (id !==_id) {
          return item;
        }
      });
      data[0].userPublishedData = newPhotoArray;
      console.log(data[0]);
      // data[0].save();

      // res.status(201).send(data[0].photo);
    }
  });

  // if (err) {
  //   res.send(err);
  // } else {
  //   let newArr= photoData[0].userPublishedData.filter((item)=>{
  //        if(id==item._id){
  //          return item;
  //        }else{
  //            console.log('no');
  //        }
  //       })
  //       newArr[0].comment.push({
  //          text:comment,
  //          commenter: name ,
  //          url: pic,
  //        });
  //        photoData[0].save();
}
