const { default: mongoose } = require("mongoose");
const Course = require("../models/course.models");
const User = require("../models/user.models");
const { instance } = require("../config/razorpay");
const mailSender = require("../utils/mailSender.utils");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentMail.templates");

// as the user hits "Pay now" button , then user will be directed to razorpay page directly and he/she will pay the amount to ur bank account
// now we'll pass webhook with razorpay, which will work just like token to get us know that the payment is correct and recieved

exports.capturePayment = async (req, res) => {
	try {
		//get both id
		//validate
		//validate courseDetails
		//check if user already bought the course earlier
		//create order
		//return response

		const { courseId } = req.body;
		const userId = req.userExists.id;

		if (!courseId) {
			return res.status(402).json({
				success: false,
				msg: "All fields are required",
			});
		}

		let courseDetails;
		try {
			courseDetails = await Course.findById(courseId);
			if (!courseDetails) {
				return res.status(402).json({
					success: false,
					msg: "Could not find course",
				});
			}

			const uid = new mongoose.Types.ObjectId(userId);
			if (courseDetails.studentsEnrolled.includes(uid)) {
				return res.status(402).json({
					success: false,
					msg: "User has already bought this course",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				success: false,
				msg: error.message,
			});
		}

		// create object
		const amount = courseDetails.price;
		const currency = "INR";

		const options = {
			amount: amount * 100,
			currency: currency,
			receipt: Math.random(Date.now()).toString(),
			notes: {
				courseId: courseId,
				userId: userId,
			},
		};

		try {
			const paymentResponse = await instance.orders.create(options);
			console.log(paymentResponse);

			return res.status(200).json({
				success: true,
				courseName: courseDetails.courseName,
				courseDescription: courseDetails.courseDescription,
				thumbNail: courseDetails.thumbNail,
				orderId: paymentResponse.id,
				currency: paymentResponse.currency,
				amount: paymentResponse.amount,
			});
		} catch (error) {
			return res.status(402).json({
				success: false,
				msg: "Could not initiate order",
			});
		}
	} catch (error) {
		return res.status(402).json({
			success: false,
			msg: "Error in capturing payment",
		});
	}
};

exports.verifySignature = async (req, res) => {
	try {
		const webhookSecret = "123456789";

		const signature = req.headers["x-razorpay-signature"];

		// here the signature provided by razorpay , is very much secured because it is encrypted
		// so to check whether we received the correct signature for the payment
		// then we have to first encrypt our webhookSecret by using crypto.createHmac(hash_algo, secret_key)
		// then we will compare both

		const shasum = crypto.createHmac("sha256", webhookSecret);
		shasum.update(JSON.stringify(req.body)); // convert to string
		const digest = shasum.digest("hex");

		if (signature === digest) {
			console.log("Payment is authorized");

			const { courseId, userId } =
				req.body.payload.payment.entity.notes; // we stored userId and courseId in capturePayment method

			try {
				//enroll the student into the course
				const enrolledCourse = await Course.findOneAndUpdate(
					{ _id: courseId },
					{ $push: { studentsEnrolled: userId } },
					{ new: true }
				);
				console.log(enrolledCourse);

				if (!enrolledCourse) {
					return res.status(402).json({
						success: false,
						msg: "Course not found",
					});
				}

				//find the student(user) and update their
				const enrolledUser = await User.findOneAndUpdate(
					{ _id: userId },
					{ $push: { courses: courseId } },
					{ new: true }
				);
				console.log(enrolledUser);

				// confirmation ka mail send karo
				const emailResponse = mailSender(
					enrolledUser.email,
					"Congratulation, u r onboarded to our course",
					"Congrats"
				);

				return res.status(200).json({
					success: true,
					msg: "Signature Verified and course added",
				});
			} catch (error) {
				return res.status(402).json({
					success: false,
					msg: error.message,
				});
			}
		} else {
			return res.status(402).json({
				success: false,
				msg: "Invalid request",
			});
		}
	} catch (error) {
		return res.status(402).json({
			success: false,
			msg: "Error in verifying signature",
		});
	}
};
