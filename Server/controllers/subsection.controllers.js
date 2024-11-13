const Section = require("../models/section.models");
const SubSection = require("../models/subSection.models");
const { imageUploader } = require("../utils/imageUploader.utils");
require("dotenv").config();

exports.createSubSection = async (req, res) => {
	try {
		//fetch data from req body
		//fetch file/video from req files
		//validate
		//upload video to cloudinary
		//create entry in db
		//add objectId in section model
		//return

		const { courseId, title, timeDuration, description } = req.body;

		const video = req.files.videoFile;

		if (!title || !courseId || !timeDuration || !description || !video) {
			return res.status(402).json({
				success: false,
				msg: "All fields are required",
			});
		}

		const uploadDetails = await imageUploader(
			video,
			process.env.FOLDER_NAME
		);
		console.log("Upload details for videoUrl : ", uploadDetails);

		const response = await SubSection.create({
			title,
			timeDuration,
			description,
			video: uploadDetails.secure_url,
		});

		await Section.findByIdAndUpdate(
			courseId,
			{ $push: { subSection: response._id } },
			{ new: true }
		);
		// TODO : use populate

		return res.status(200).json({
			success: true,
			data: response,
			msg: "Sub Section created successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			msg: "Error in creating subsection",
		});
	}
};

// TODO : idk this is right or wrong
exports.updateSubSection = async (req, res) => {
	try {
		//fetch data
		//validate
		//update data in Section model
		//return response
		const { title, timeDuration, description, subSectionId } = req.body;

		const video = req.files.videoFile;

		if (
			!title ||
			!subSectionId ||
			!timeDuration ||
			!description ||
			!video
		) {
			return res.status(402).json({
				success: false,
				msg: "All fields are required",
			});
		}

		const uploadDetails = await imageUploader(
			video,
			process.env.FOLDER_NAME
		);
		console.log("Upload details for videoUrl : ", uploadDetails);

		const response = await SubSection.findByIdAndUpdate(subSectionId, {
			title: title,
			timeDuration: timeDuration,
			description: description,
			video: uploadDetails.secure_url,
		});

		return res.status(200).json({
			success: true,
			data: response,
			msg: "sub section updated successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			msg: "Error in updating sub section",
		});
	}
};

// TODO : idk this is right or wrong
exports.deleteSection = async (req, res) => {
	try {
		//fetch id
		//validate
		//delete
		//return

		const { subSectionId } = req.params;
		if (!subSectionId) {
			return res.status(402).json({
				success: false,
				msg: "All fields are required",
			});
		}

		await Section.findByIdAndDelete(subSectionId);

		// TODO : Do we need to delete the entry from course schema ??

		return res.status(200).json({
			success: true,
			msg: "subsection deleted successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			msg: "Error in deleting subsection",
		});
	}
};

// TODO : getAllSubSectionDetails
