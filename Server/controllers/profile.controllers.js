const Profile = require('../models/profile.models')
const User = require('../models/user.models')
const Profile = require('../models/profile.models')

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

          if (!gender || !contactNumber || !userId) {
			return res.status(403).json({
				success: false,
				msg: "All fields are required",
			});
		};

          const userDetails = await User.findById({userId});
          const profileId = userDetails.additionalDetails;
          const profileDetails = await Profile.findById({profileId});

          profileDetails.dateOfBirth = dateOfBirth;
          profileDetails.gender = gender;
          profileDetails.about = about;
          profileDetails.contactNumber = contactNumber;
          await profileDetails.save();

          return res.status(200).json({
               success: true,
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
          const response = await User.findById(userId).populate("additionDetails")
          return res.status(200).json({
               success: true,
               msg: "All Data fetched successfully",
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               msg: "Error in fetching all user data",
          });
     }
}