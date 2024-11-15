const Profile = require('../models/profile.models')
const User = require('../models/user.models');
const { imageUploader } = require('../utils/imageUploader.utils');

// in auth.controller while signup we entered null entries for all profile data , i.e.
/*   const profileDetails = await Profile.create({
          gender: null,
          dateOfBirth: null,
          about: null,
          contactNumber: null,
     });  */
// so here we are not going to create profile , we are directly updating it

exports.updateProfile = async(req,res) => {
     try {
          //get data
          //get userId
          //validate
          //find profile
          //update by id in DB
          //return resp

          const {gender, dateOfBirth="", about="", contactNumber} = req.body;

          const userId = req.userExists.id;
          console.log("User ID : ",userId)

          if (!gender || !contactNumber || !userId) {
			return res.status(403).json({
				success: false,
				msg: "All fields are required",
			});
		};

          const userDetails = await User.findById(userId);
          console.log("userDetails ",userDetails );
          const profileId = userDetails.additionalDetails;
          console.log(" profileId ", profileId);
          const profileDetails = await Profile.findById({_id:profileId});
          console.log("profileDetails ", profileDetails);

          profileDetails.dateOfBirth = dateOfBirth;
          profileDetails.gender = gender;
          profileDetails.about = about;
          profileDetails.contactNumber = contactNumber;
          await profileDetails.save();

          return res.status(200).json({
               success: true,
               profileDetails,
               msg: "Profile updated successfully",
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               msg: "Error in updating profile",
          });
     }
}

exports.deleteProfile = async(req,res) => {
     try {
          //get id
          //validate
          //delete profile
          //delete user
          //return resp

          const userId = req.userExists.id;

          const userDetails = await User.findById(userId);
          if(!userDetails){
               return res.status(400).json({
                    success: false,
                    msg: "User not found",
               });
          }

          await Profile.findByIdAndDelete({_id : userDetails.additionalDetails});
          
          await User.findByIdAndDelete(userId);

          // TODO : unenroll from studentsEnrolled too after deleting
          // const getCoursesEnrolled = userDetails.courses
          
          // const unEnrollFromCourse =

          return res.status(200).json({
               success: true,
               msg: "Profile deleted successfully",
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               msg: "Error in deleting profile",
          });
     }
}

exports.getAllUserDetails = async(req,res) => {
     try {
          const userId = req.userExists.id;
          console.log("UserId" ,userId)
          const response = await User.findById(userId).populate("additionalDetails").exec();

          if(!response){
               return res.json({
                    success:false,
                    msg:"User data not found"
               })
          }
          console.log("response ",response)
          return res.status(200).json({
               success: true,
               response,
               msg: "All Data fetched successfully",
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               msg: "Error in fetching all user data",
          });
     }
}

exports.updateDisplayPicture = async(req,res) => {
     try {
          const userId = req.userExists.id;

          const newImage = req.files.displayPicture;

          const image = await imageUploader(newImage, process.env.FOLDER_NAME,1000,1000);
          // console.log("Image content ",image)

          const userDetails = await User.findByIdAndUpdate({_id:userId},{image:image.secure_url},{new:true});
          // console.log("User details ",userDetails)
          if(!userDetails){
               return res.status(400).json({
                    success: false,
                    msg: "User not found",
               });
          }

          return res.status(200).json({
               success: true,
               msg: "Profile picture updated",
               data:userDetails,
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               msg: "Error in updating display picture",
          });
     }
}