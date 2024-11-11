const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
     courseName:{
          type:String,
          trim:true,
          required:true,
     },
     courseDescription:{
          type:String,
          trim:true,
          required:true,
     },
     instructor:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User"
     },
     whatYouWillLearn:{
          type:String,
     },
     courseContent:[
          {
               type:mongoose.Schema.Types.ObjectId,
               ref:"Section"
          }
     ],
     ratingsAndReviews:[
          {
               type:mongoose.Schema.Types.ObjectId,
               ref:"RatingsAndReviews"
          }
     ],
     price:{
          type:Number,
     },
     thumbNail:{
          type:String,
     },
     tag:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Tags"
     },
     studentsEnrolled:[
          {
               type:mongoose.Schema.Types.ObjectId,
               ref:"User",
               required:true,
          }
     ],
     
})

module.exports = mongoose.model("Course",courseSchema);