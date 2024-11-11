const User = require("../models/user.models");
const OTP = require("../models/otp.models");
const OTPGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mailSender = require("../utils/mailSender.utils");
require("dotenv").config()

exports.sendOTP = async (req, res) => {
	try {
		//fetch email
		//check  if user already exists
		//if yes then return
		//if no then generate OTP & check its uniqueness & create DB entry & return response

		const { email } = req.body;
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(401).json({
				success: false,
				msg: "User already exists",
			});
		}

		var generatedOTP = OTPGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		console.log("Genrated OTP : ", generatedOTP);

		const otpExists = await OTP.findOne({ otp: generatedOTP });
		while (otpExists) {
			generatedOTP = OTPGenerator.generate(6, {
				upperCaseAlphabets: false,
				lowerCaseAlphabets: false,
				specialChars: false,
			});
			otpExists = await OTP.findOne({ otp: generatedOTP });
		}

		const otpPayload = { email, generatedOTP };
		const response = await OTP.create(otpPayload);
		console.log(response);
		return res.status(200).json({
			success: true,
			msg: "OTP sent successfully",
			OTP: generatedOTP,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: "Error in sending OTP",
		});
	}
};

exports.signUp = async (req, res) => {
	try {
		// get all things from model
		// validate
		// check if user already exists or not
		// check if password and confirmPassword are the same
		// find most recent OTP stored for the user
		// validate OTP
		// hash password
		// create db entry
		// return res

		const {
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
			accountType,
			contactNumber,
			otp,
		} = req.body;

		if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			!confirmPassword ||
			!contactNumber ||
			!otp
		) {
			return res.status(403).json({
				success: false,
				msg: "All fields are required",
			});
		}

		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(401).json({
				success: false,
				msg: "User already exists",
			});
		}

		if (password !== confirmPassword) {
			return res.status(401).json({
				success: false,
				msg: "Password and confirmPassword does not match",
			});
		}

		const recentOTP = await OTP.findOne({ email })
			.sort({ createdAt: -1 })
			.limit(1);
		console.log(recentOTP);
		if (recentOTP.length == 0) {
			// otp not found
			return res.status(401).json({
				success: false,
				msg: "OTP not found",
			});
		} else if (otp !== recentOTP.otp) {
			// otp not matched
			return res.status(401).json({
				success: false,
				msg: "Invalid OTP",
			});
		}

		const hashedPass = await bcrypt.hash(password, 10);

          const profileDetails = await Profile.create({
               gender:null,
               dateOfBirth:null,
               about:null,
               contactNumber:null,
          })
		const response = await User.create({
			firstName,
			lastName,
			email,
			password: hashedPass,
			accountType,
			contactNumber,
               additionalDetails:profileDetails,
               image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
		});

		return res.status(300).json({
			success: true,
			msg: "Signed up successfully",
               response,
		});
	} catch (error) {
          console.log(error)
		return res.status(500).json({
			success: false,
			msg: "User cannot be registered, Please try again later",
		});
	}
};

exports.login = async (req,res) => {
     try {
          //fetch accounttype,email,password for req body
          //validate data
          //check if user exists or not, if not then return res
          //generate token, after password matching
          //create cookie
          //return res

          const {email,password,accountType} = req.body;

          if (!email || !password) {
			return res.status(403).json({
				success: false,
				msg: "All fields are required",
			});
		}

          const userExists = await User.findOne({email}).populate("additionalDetails");
          if(!userExists){
               return res.status(400).json({
				success: false,
				msg: "User does not exists",
			});
          }

          if(await bcrypt.compare(password,userExists.password)){
               const payload = {
                    id:userExists._id,
                    email:userExists.email,
                    accountType:userExists.accountType,
               }
               let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"2h"});

               userExists.token = token;
               userExists.password = undefined;

               const options = {
                    expires:new Date (Date.now() + 3*24*60*60*1000),
                    httpOnly:true,
               }
               res.cookie("userCookie",token,options).status(200).json({
                    success:true,
                    token,
                    userExists,
                    msg:"User logged in successfully"
               })
          }else{
               // password do not match
               return res.status(400).json({
                    success:false,
                    msg:"Incorrect password"
               })
          }

     } catch (error) {
          return res.status(500).json({
               success: false,
               msg: "Error in login",
          });
     }
};

exports.changePassword = async(req,res) => {
     try {
          //get data for req body
          //get old, new and confirm password
          //validation
          //update in db
          //send mail - password updated
          //return res
          const {email, newPassword, confirmPassword} = req.body;

          if(!email || !newPassword || !confirmPassword){
               return res.status(403).json({
                    success: false,
                    msg: "All fields are required",
               });
          }

          if(newPassword !== confirmPassword){
               return res.status(403).json({
                    success: false,
                    msg: "New Password and confirm password does not match",
               });
          }

          const userExists = await User.findOne({email});
          if(!userExists){
               return res.status(400).json({
                    success: false,
                    msg: "User does not exists",
               });
          }
          
          const response = await User.findOneAndUpdate({email:email},{password:newPassword});

          // mail sending
          try {
               const mailResp = await mailSender(userExists.email,"Study Notion" ,"Your Study Notion Password in Updated successfully");
               console.log("Mail response for password updation : ",mailResp);
          } catch (error) {
               console.log("Error in sending mail for password update ", error.message);
          }

          return res.status(200).json({
               success:true,
               msg:"Password changed successfully",
          });

     } catch (error) {
          return res.status(500).json({
               success:true,
               msg:"Error in Password update",
          })
     }

}