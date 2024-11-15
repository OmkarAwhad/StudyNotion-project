const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender.utils");
const otpTemplate = require("../mail/templates/emailVerificationTemplate.templates");

const otpSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
		expires: 5 * 60,
	},
});

async function sendVerificationEmail(email, otp) {
	try {
		console.log("Sending verification email to:", email);
		const mailRes = await mailSender(
			email,
			"Verification email from StudyNotion",
			otpTemplate(otp)
		);
		console.log("Mail send successfully", mailRes);
	} catch (error) {
		console.log("Error occured while sending mails : ", error);
		throw error;
	}
}

otpSchema.pre("save", async (next) => {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}

	next();
});

module.exports = mongoose.model("OTP", otpSchema);
