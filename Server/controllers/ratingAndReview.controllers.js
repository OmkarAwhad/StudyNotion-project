const RatingsAndReviews = require("../models/ratingsAndReviews.models");
const User = require("../models/user.models");
const Course = require("../models/course.models");
const { default: mongoose } = require("mongoose");

exports.createRatingsAndReviews = async (req, res) => {
	try {
		//get data
		//get userId
		//validate
		//check if user is enrolled in that course or not
		//already reviewed or not
		//create db entry
		//add entry in course model
		//return resp

		const { rating, review, courseId } = req.body;
		const userId = req.userExiste.id;

		if (!userId || !rating || !review || !courseId) {
			return res.status(402).json({
				success: false,
				msg: "All fields are required",
			});
		}

		const courseDetails = await Course.findOne({
			_id: courseId,
			studentsEnrolled: { $elemMatch: { $eq: userId } },
		});

		if (!courseDetails) {
			return res.status(402).json({
				success: false,
				msg: "Course not found",
			});
		}

		const alreadyReviewed = await RatingsAndReviews.findOne({
			user: userId,
			course: courseId,
		});
		if (alreadyReviewed) {
			return res.status(402).json({
				success: false,
				msg: "Already reviewed and rated the course",
			});
		}

		const response = await RatingsAndReviews.create({
			user: userId,
			rating,
			review,
			course: courseId,
		});

		const updatedCourseDetails = await Course.findByIdAndUpdate(
			courseId,
			{ $push: { ratingsAndReviews: response._id } },
			{ new: true }
		);
		console.log("updatedCourseDetails", updatedCourseDetails);

		return res.status(200).json({
			success: true,
			msg: "Rated and reviewed the course",
			data: response,
		});
	} catch (error) {
		console.log(error);
		return res.status(402).json({
			success: false,
			msg: "Error in rating the course",
		});
	}
};

exports.getAverageRating = async (req, res) => {
	try {
		//get course id
		//cal avg rating
		//return rating

		const { courseId } = req.body;

		const result = await RatingsAndReviews.aggregate([
			{
				$match: {
					course: new mongoose.Types.ObjectId(courseId),
				},
			},
			{
				$group: {
					_id: null,
					averageRating: { $avg: "$rating" },
				},
			},
		]);

		if (result.length > 0) {
			return res.status(200).json({
				success: true,
				averageRating: result[0].averageRating,
			});
		}

		return res.status(200).json({
			success: true,
			msg: "Average rating is 0 till now, no ratings given",
			averageRating: 0,
		});
	} catch (error) {
		console.log(error);
		return res.status(402).json({
			success: false,
			msg: "Error in rating the course",
		});
	}
};

exports.getAllRatings = async (req, res) => {
	try {
		const response = await RatingsAndReviews.find({})
			.sort({ rating: "desc" })
			.populate({
				path: "user",
				select: "firstName lastName email image",
			})
			.populate({
				path: "course",
				select: "courseName",
			})
			.exec();

		if (!response) {
			return res.status(402).json({
				success: false,
				msg: "Ratings not found",
			});
		}

		return res.status(200).json({
			success: true,
			msg: "All ratings and reviews fetched successfully",
			data: response,
		});
	} catch (error) {
		console.log(error);
		return res.status(402).json({
			success: false,
			msg: "Error in fetching all ratings",
		});
	}
};
