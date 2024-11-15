const User = require("../models/user.models");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender.utils");
const bcrypt = require("bcrypt");

//generate a link   ]
//                  | -> part 1 (resetPasswordToken)
//send mail         ]

//UI                ]
//                  | -> part 2 (resetPassword)
//update password   ]

exports.resetPasswordToken = async (req, res) => {
	try {
		//get mail for req body
		//check mail
		//generate token
		//update user db by adding token and expire time
		//create link
		//send mail
		//return res

		const { email } = req.body;
		const userExists = await User.findOne({ email }).populate(
			"additionalDetails"
		);
		if (!userExists) {
			return res.status(400).json({
				success: false,
				msg: "User does not exists",
			});
		}

		const token = crypto.randomUUID();

		const updateUser = await User.findOneAndUpdate(
			{ email: email },
			{
				token: token,
				resetPasswordExpires: Date.now() + 5 * 60 * 1000,
			},
			{ new: true }
		);

		const url = `http://localhost:3000/update-password/${token}`;

		await mailSender(
			email,
			"Password Reset Link",
			`Password Reset Link ${url}`
		);

		return res.status(200).json({
			success: true,
			msg: "Email sent successfully, please check email ",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			msg: "Error in sending mail x`",
		});
	}
};

exports.resetPassword = async (req, res) => {
	try {
		//fetch data
		//validate
		//using token we are going to update password for that user in the DB
		//fetch token
		//validate (expired or not)(valid or invalid)
		// if valid -> then get user details from DB
		// hash password
		//update in db
		//return res

		const { password, confirmPassword,token } = req.body;
		console.log("Req body se utha liya re")
		if (!password || !confirmPassword) {
			return res.status(401).json({
				success: false,
				msg: "All fields are required",
			});
		}

		if (password !== confirmPassword) {
			return res.status(401).json({
				success: false,
				msg: "Password and Confirm Password does not match",
			});
		}

		const userExists = await User.findOne({ token: token });
		if (!userExists) {
			return res.status(401).json({
				success: false,
				msg: "User doesn't exist",
			});
		}

		//token time check
		if (userExists.resetPasswordExpires > Date.now()) {
			return res.status(401).json({
				success: false,
				msg: "Token expired",
			});
		}

		const hashPass = await bcrypt.hash(password, 10);

		await User.findOneAndUpdate(
			{ token: token },
			{ password: hashPass },
			{ new: true }
		);

		return res.status(200).json({
			success: true,
			msg: "Password reset successful",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: "Error in password reset",
		});
	}
};
