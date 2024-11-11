const mongoose = require('mongoose')

const SubSectionSchema = new mongoose.Schema({
     title:{
          type:String,
     },
     timeDuration:{
          type:String,
     },
     description:{
          type:String,
          trim:true,
     },
     videoUrl:{
          type:String,
          required:true,
     },
     
})

module.exports = mongoose.model("SubSection",SubSectionSchema);