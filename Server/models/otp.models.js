const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender.utils');


const otpSchema = new mongoose.Schema({
     email:{
          type:String,
          required:true,
     },
     otp:{
          type:String,
          required:true,
     },
     createdAt:{
          type:Date,
          default:Date.now(),
          expires:5*60*1000 , 
     }
})

async function sendVerificationEmail(email,otp){
     try {
          const mailRes = await mailSender(email,"Verification email from StudyNotion",otp);
          console.log("Mail send successfully", mailRes)
     } catch (error) {
          console.log("Error occured while sending mails : ", error.message);
          throw error;
     }
}

otpSchema.pre("save", async(next) => {
     await sendVerificationEmail(this.email, this.otp);
     next();
})

module.exports = mongoose.model("OTP",otpSchema);