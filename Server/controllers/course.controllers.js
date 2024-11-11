const Course = require("../models/course.models");
const Tag = require("../models/tags.models");
const User = require("../models/user.models");
const Section = require("../models/section.models");
require("dotenv").config();
const { imageUploader } = require("../utils/imageUploader.utils");

exports.createCourse = async (req, res) => {
	try {
		//fetch data
		//fetch file
		//validate data
		//validate instructor
		//validate tag
		//upload image to cloudinary
		//create entry in DB
		//add entry in User and Tag DB too
		//return response

		const {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
		} = req.body;

		const thumbNail = req.files.thumbNailImage;

		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag ||
			!thumbNail
		) {
			return res.status(402).json({
				success: false,
				msg: "All fields are required",
			});
		}

		const userId = req.userExists.id;
		const instructorDetails = await User.findById({ userId });
		console.log("Instructor Details : ", instructorDetails);

		if (!instructorDetails) {
			return res.status(402).json({
				success: false,
				msg: "Instructor not found",
			});
		}

		const tagDetails = await Tag.findById({ tag });
		if (!tagDetails) {
			return res.status(402).json({
				success: false,
				msg: "Tag not found",
			});
		}

		const thumbNailImage = await imageUploader(
			thumbNail,
			process.env.FOLDER_NAME
		);

		const response = await Course.create({
			courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn,
			price,
			thumbNail: thumbNailImage.secure_url,
			tag: tagDetails._id,
		});

		await User.findByIdAndUpdate(
			{ _id: instructorDetails._id },
			{ $push: { courses: response._id } },
			{ new: true }
		);

		await Tag.findByIdAndUpdate(
			{ _id: tagDetails._id },
			{ $push: { course: response._id } },
			{ new: true }
		);

		return res.status(200).json({
			success: true,
			msg: "Course created successfully",
			data: response,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: "Error in creating course",
		});
	}
};

exports.getAllCourses = async (req, res) => {
	try {
		const response = await Course.find(
			{},
			{
				courseName: true,
				courseDescription: true,
				thumbNail: true,
				instructor: true,
				ratingsAndReviews: true,
				studentsEnrolled: true,
			}
		)
			.populate("instructor")
			.exec();

		return res.status(200).json({
			success: true,
			msg: "All courses fetched successfully",
			data: response,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: "Error in creating course",
		});
	}
};
