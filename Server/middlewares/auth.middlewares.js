const jwt = require('jsonwebtoken')
const User = require('../models/user.models')
require('dotenv').config();

exports.authN = async(req,res,next) => {
     try {
          //extract token
          //check if token is there or not
          //verify token
          //next


          // console.log("Now i'm in authN middleware")
          // console.log("Fetching token")
          // const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");
          // console.log("Token : ",token)

          let token;
          // Check Authorization header first
          const authHeader = req.headers.authorization;
          if (req.cookies && req.cookies.userCookie) {
               token = req.cookies.userCookie;
               console.log("Token fetched from cookie")
          }else if (authHeader && authHeader.startsWith('Bearer ')) {
               token = authHeader.split(' ')[1];
               console.log("Token fetched from header")
          }
          // Finally check body
          else if (req.body && req.body.token) {
               token = req.body.token;
               console.log("Token fetched from body")
          }
          console.log("Token : ",token)

          if(!token){
               console.error("Token not found in request");
               return res.status(401).json({
                    success:false,
                    msg:"Token Missing",
               })
          }

          try {
               const payload = await jwt.verify(token, process.env.JWT_SECRET);
               console.log("Token verified successfully:", payload);
               req.userExists = payload;
          } catch (error) {
               console.error("Error during token verification:", error.message);  // Log the specific error message
               return res.status(401).json({
                    success: false,
                    msg: "Invalid Token in authN",
               });
          }
          
          
          next();

     } catch (error) {
          console.log("Error in verifying token")
          return res.status(500).json({
               success:false,
               msg:"Something went wrong, while verifying token",
          })
     }
}

exports.isStudent = async(req,res,next) => {
     try {
          if(req.userExists.accountType !== "Student"){
               return res.status(401).json({
                    success:false,
                    msg:"This is a protected route for Students",
               });
          }

          next();
     } catch (error) {
          return res.status(401).json({
               success:false,
               msg:"Error in students protected route",
          })
     }
}

exports.isAdmin = async(req,res,next) => {
     try {
          if(req.userExists.accountType !== "Admin"){
               return res.status(401).json({
                    success:false,
                    msg:"This is a protected route for Admins",
               });
          }

          next();
     } catch (error) {
          return res.status(401).json({
               success:false,
               msg:"Error in Admins protected route",
          })
     }
}

exports.isInstructor = async(req,res,next) => {
     try {
          if(req.userExists.accountType !== "Instructor"){
               return res.status(401).json({
                    success:false,
                    msg:"This is a protected route for Instructors",
               });
          }

          next();
     } catch (error) {
          return res.status(401).json({
               success:false,
               msg:"Error in Instructors protected route",
          })
     }
}

