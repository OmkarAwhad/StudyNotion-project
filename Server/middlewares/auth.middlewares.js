const jwt = require('jsonwebtoken')
const User = require('../models/user.models')
require('dotenv').config();

exports.authN = async(req,res,next) => {
     try {
          //extract token
          //check if token is there or not
          //verify token
          //next

          const token = req.body.token || req.cookies.token || req.header("Authorisation").replace("Bearer","");

          if(!token){
               return res.status(401).json({
                    success:false,
                    msg:"Token Missing",
               })
          }

          try {
               const resp = await jwt.verify(token, process.env.JWT_SECRET);
               console.log("Token verifying response ", resp);

               req.userExists = resp;
          } catch (error) {
               return res.status(401).json({
                    success:false,
                    msg:"Invalid Token",
               })
          }
          
          next();

     } catch (error) {
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

