const Course = require("../models/course.models");
const Category = require("../models/category.models");
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
		//validate Category
		//upload image to cloudinary
		//create entry in DB
		//add entry in User and Category DB too
		//return response

		const {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			category,
			tag: _tag,
			instructions: _instructions,
			// status,
		} = req.body;

		const thumbNail = req.files.thumbNailImage;

		const tag = JSON.parse(_tag);
		const instructions = JSON.parse(_instructions);

		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!category ||
			!tag.length > 0 ||
			!instructions.length > 0 ||
			!thumbNail
		) {
			return res.status(402).json({
				success: false,
				msg: "All fields are required",
			});
		}

		// if (!status || status === undefined) {
		// 	status = "Draft";
		// }

		const userId = req.userExists.id;
		const instructorDetails = await User.findById({ _id: userId });
		console.log("Instructor Details : ", instructorDetails);

		if (!instructorDetails) {
			return res.status(402).json({
				success: false,
				msg: "Instructor not found",
			});
		}

		const categoryDetails = await Category.findById({ _id: category });
		if (!categoryDetails) {
			return res.status(402).json({
				success: false,
				msg: "Category not found",
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
			category: categoryDetails._id,
			tag,
			instructions,
		});

		await User.findByIdAndUpdate(
			{ _id: instructorDetails._id },
			{ $push: { courses: response._id } },
			{ new: true }
		);

		await Category.findByIdAndUpdate(
			{ _id: categoryDetails._id },
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

exports.getCourseDetails = async (req, res) => {
	try {
		// courseId de rahe aur entire course detail mangta hai populate karke

		const { courseId } = req.body;

		if (!courseId) {
			return res.status(402).json({
				success: false,
				msg: "Course ID not found",
			});
		}

		const response = await Course.find({ _id: courseId })
			.populate({
				path: "instructor",
				populate: {
					path: "additionalDetails",
				},
			})
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.populate("ratingsAndReviews")
			.populate("category")
			.populate("studentsEnrolled")
			.exec();

		if (!response) {
			return res.status(402).json({
				success: false,
				msg: `Course not found with id ${courseId}`,
			});
		}

		return res.status(200).json({
			success: true,
			msg: "Course details fetched successfully",
			data: response,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: "Error in fetching course details",
		});
	}
};

exports.editCourse = async (req, res) => {
	try {
		const { courseId } = req.body
		const updates = req.body
		const course = await Course.findById(courseId)

		if (!course) {
			return res.status(404).json({ error: "Course not found" })
		}

		// If Thumbnail Image is found, update it
		if (req.files) {
			console.log("thumbnail update")
			const thumbnail = req.files.thumbnailImage
			const thumbnailImage = await imageUploader(
				thumbnail,
				process.env.FOLDER_NAME
			)
			course.thumbnail = thumbnailImage.secure_url
		}

		// Update only the fields that are present in the request body
		for (const key in updates) {
			if (updates.hasOwnProperty(key)) {
				if (key === "tag" || key === "instructions") {
					course[key] = JSON.parse(updates[key])
				} else {
					course[key] = updates[key]
				}
			}
		}

		await course.save()

		const updatedCourse = await Course.findOne({
			_id: courseId,
		})
			.populate({
				path: "instructor",
				populate: {
					path: "additionalDetails",
				},
			})
			.populate("category")
			.populate("ratingAndReviews")
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec()

		res.json({
			success: true,
			message: "Course updated successfully",
			data: updatedCourse,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		})
	}
}

exports.getFullCourseDetails = async (req, res) => {
	try {
		const { courseId } = req.body
		const userId = req.userExists.id
		const courseDetails = await Course.findOne({
			_id: courseId,
		})
			.populate({
				path: "instructor",
				populate: {
					path: "additionalDetails",
				},
			})
			.populate("category")
			.populate("ratingAndReviews")
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec()

		let courseProgressCount = await CourseProgress.findOne({
			courseID: courseId,
			userId: userId,
		})

		console.log("courseProgressCount : ", courseProgressCount)

		if (!courseDetails) {
			return res.status(400).json({
				success: false,
				message: `Could not find course with id: ${courseId}`,
			})
		}

		// if (courseDetails.status === "Draft") {
		//   return res.status(403).json({
		//     success: false,
		//     message: `Accessing a draft course is forbidden`,
		//   });
		// }

		let totalDurationInSeconds = 0
		courseDetails.courseContent.forEach((content) => {
			content.subSection.forEach((subSection) => {
				const timeDurationInSeconds = parseInt(subSection.timeDuration)
				totalDurationInSeconds += timeDurationInSeconds
			})
		})

		const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

		return res.status(200).json({
			success: true,
			data: {
				courseDetails,
				totalDuration,
				completedVideos: courseProgressCount?.completedVideos
					? courseProgressCount?.completedVideos
					: [],
			},
		})
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
	try {
		// Get the instructor ID from the authenticated user or request body
		const instructorId = req.user.id

		// Find all courses belonging to the instructor
		const instructorCourses = await Course.find({
			instructor: instructorId,
		}).sort({ createdAt: -1 })

		// Return the instructor's courses
		res.status(200).json({
			success: true,
			data: instructorCourses,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: "Failed to retrieve instructor courses",
			error: error.message,
		})
	}
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
	try {
		const { courseId } = req.body

		// Find the course
		const course = await Course.findById(courseId)
		if (!course) {
			return res.status(404).json({ message: "Course not found" })
		}

		// Unenroll students from the course
		const studentsEnrolled = course.studentsEnroled
		for (const studentId of studentsEnrolled) {
			await User.findByIdAndUpdate(studentId, {
				$pull: { courses: courseId },
			})
		}

		// Delete sections and sub-sections
		const courseSections = course.courseContent
		for (const sectionId of courseSections) {
			// Delete sub-sections of the section
			const section = await Section.findById(sectionId)
			if (section) {
				const subSections = section.subSection
				for (const subSectionId of subSections) {
					await SubSection.findByIdAndDelete(subSectionId)
				}
			}

			// Delete the section
			await Section.findByIdAndDelete(sectionId)
		}

		// Delete the course
		await Course.findByIdAndDelete(courseId)

		return res.status(200).json({
			success: true,
			message: "Course deleted successfully",
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			success: false,
			message: "Server error",
			error: error.message,
		})
	}
}
