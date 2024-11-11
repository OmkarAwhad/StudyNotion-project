const Tag = require('../models/tags.models')


exports.createTag = async(req,res) => {
     try {
          //fetch data
          //validate
          //create entry in DB
          //return res

          //courses data will be added when we'll create course

          const {name,description} = req.body;
          if(!name || !description){
               return res.status(401).json({
                    success:false,
                    msg:"All fields are required",
               })
          };

          const response = await Tag.create({name, description});
          console.log("Tag created resp : ",response)

          return res.status(200).json({
               success:true,
               msg:"Tag created successfully",
          });

     } catch (error) {
          return res.status(500).json({
               success:false,
               msg:"Something went wrong, in creating tag",
          })
     }
}

exports.showAllTags = async(req,res) => {
     try {
          const resp = await Tag.find({}, {name:true, description:true});

          return res.status(200).json({
               success:true,
               Tags:resp,
               msg:"Tag created successfully",
          });
     } catch (error) {
          return res.status(500).json({
               success:false,
               msg:"Something went wrong, in fetching all tags",
          })
     }
}