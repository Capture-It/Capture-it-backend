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

mongoose.connect('mongodb://localhost:27017/capture', { useNewUrlParser: true, useUnifiedTopology: true });

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
    console.log(req.body);
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
        console.log( 'firstfunc', photoData[0]);
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
        let { ownerEmail, userComment, userName, userPic,userPicId } = req.body;
        console.log('from comment:',req.body);
      
        publishedUserSchemaModel.find({ email: ownerEmail },  function (err, photoData) {
          if (err) {
            res.send(err);
          } else {
            console.log('email is founded',photoData[0] );
            let newArr= photoData[0].userPublishedData.filter((item)=>{
              console.log('photo id ',userPicId);
                 if(userPicId==item._id){
                   console.log('related item is found ',item);
                   return item;
                 }else{
                     console.log('no');
                 }
                });
                console.log('founded item arr test ', newArr[0]);
                newArr[0].comment.push({
                   text:userComment,
                   commenter: userName ,
                   url: userPic,
                 });
                 photoData[0].save();
                 console.log('cooment after usdate ',photoData[0].userPublishedData[0].comment);
                 res.send(photoData[0]);
                 
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
  const { email ,url } = req.query;

  // const url = req.params.url;
  console.log('photo url 1: ',url);
  // console.log('user email : ',email);
  // console.log("from the front ",url);
  publishedUserSchemaModel.find({ email: email },  function (err, photoData) {
    console.log("before filter: ",photoData);
    if (err) {
      res.send(err);
    } else {
       let newdata= photoData[0].userPublishedData.filter((item)=>{
        console.log(item.url);
           if(url!==item.url){
             console.log('mathced');
             return item;
           }else{
               console.log('no');
           }
          });
          console.log('after filter: ',newdata);
          photoData[0].userPublishedData=newdata;
          photoData[0].save();
          res.send(photoData[0].userPublishedData);
           
          //  photoData.save();
        }
      });
    }



// new del

// function deletePublishedphoto(req, res) {
//   const { email } = req.query;
//   const url = req.params.url;
//   console.log((email));
//   console.log("from the front",url);
//   publishedUserSchemaModel.find({ email: email },  function (err, photoData) {
//     console.log("first",photoData);
//     if (err) {
//       res.send(err);
//     } else {
//        photoData= photoData[0].userPublishedData.filter((item)=>{
//         console.log(item.url);
//            if(url!==item.url){
//              console.log('mathced');
//              return item;
//            }else{
//                console.log('no');
//            }
//           })
//            console.log('after',photoData);
//           //  photoData.save();
//         }
//       });
//     }







// end
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
//
/// 
///old 
// function deletePublishedphoto(req, res) {
//   const { email } = req.query;
//   const id = req.params.id;
//   console.log((email));
//   console.log(id);

//   publishedUserSchemaModel.find({ email: email }, (err, data) => {
//     if (err) {
//       res.status(500).send(err.message);
//     } else {
//       const newPhotoArray = data[0].userPublishedData.filter((item) => {
//         if (id !==item._id) {
//           console.log(item);
//           return item;
//         }
//       });
//       console.log('newphoto..',newPhotoArray);
//       data[0].userPublishedData = newPhotoArray;
//       // console.log(data);
//       data[0].save();

//       res.status(201).send('deleted');
      
//     }
//   });