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

		const { sectionId, title, timeDuration, description } = req.body;
		console.log("steps")

		const video = req.files.videoFile;
		console.log("steps")

		if (!title || !sectionId || !timeDuration || !description || !video) {
			return res.status(402).json({
				success: false,
				msg: "All fields are required",
			});
		}
		console.log("steps")

		const uploadDetails = await imageUploader(
			video,
			process.env.FOLDER_NAME
		);
		console.log("Upload details for videoUrl : ", uploadDetails);

		const response = await SubSection.create({
			title,
			timeDuration,
			description,
			videoUrl: uploadDetails.secure_url,
		});

		const updatedSection = await Section.findByIdAndUpdate(
			sectionId,
			{ $push: { subSection: response._id } },
			{ new: true }
		).populate({
			path: "subSection",
		})
		.exec();
		// TODO : use populate

		return res.status(200).json({
			success: true,
			data: updatedSection,
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

// exports.updateSubSection = async (req, res) => {
// 	try {
// 		const { sectionId, subSectionId, title, description } = req.body;
// 		const subSection = await SubSection.findById(subSectionId);

// 		if (!subSection) {
// 			return res.status(404).json({
// 				success: false,
// 				message: "SubSection not found",
// 			});
// 		}

// 		if (title !== undefined) {
// 			subSection.title = title;
// 		}

// 		if (description !== undefined) {
// 			subSection.description = description;
// 		}
// 		if (req.files && req.files.video !== undefined) {
// 			const video = req.files.video;
// 			const uploadDetails = await uploadImageToCloudinary(
// 				video,
// 				process.env.FOLDER_NAME
// 			);
// 			subSection.videoUrl = uploadDetails.secure_url;
// 			subSection.timeDuration = `${uploadDetails.duration}`;
// 		}

// 		await subSection.save();

// 		// find updated section and return it
// 		const updatedSection = await Section.findById(sectionId).populate(
// 			"subSection"
// 		);

// 		console.log("updated section", updatedSection);

// 		return res.json({
// 			success: true,
// 			message: "Section updated successfully",
// 			data: updatedSection,
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		return res.status(500).json({
// 			success: false,
// 			message: "An error occurred while updating the section",
// 		});
// 	}
// };

exports.deleteSubSection = async (req, res) => {
	try {
		const { subSectionId, sectionId } = req.body;
		await Section.findByIdAndUpdate(
			{ _id: sectionId },
			{
				$pull: {
					subSection: subSectionId,
				},
			}
		);
		const subSection = await SubSection.findByIdAndDelete({
			_id: subSectionId,
		});

		if (!subSection) {
			return res
				.status(404)
				.json({ success: false, message: "SubSection not found" });
		}

		// find updated section and return it
		const updatedSection = await Section.findById(sectionId).populate(
			"subSection"
		);

		return res.json({
			success: true,
			message: "SubSection deleted successfully",
			data: updatedSection,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "An error occurred while deleting the SubSection",
		});
	}
};

// TODO : getAllSubSectionDetails

// // TODO : idk this is right or wrong
exports.updateSubSection = async (req, res) => {
	try {
		//fetch data
		//validate
		//update data in Section model
		//return response
		const { title, timeDuration, description, subSectionId } = req.body;

		const video = req.files.video;

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
			// data: response,
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

// // TODO : idk this is right or wrong
// exports.deleteSection = async (req, res) => {
// 	try {
// 		//fetch id
// 		//validate
// 		//delete
// 		//return

// 		const { subSectionId } = req.params;
// 		if (!subSectionId) {
// 			return res.status(402).json({
// 				success: false,
// 				msg: "All fields are required",
// 			});
// 		}

// 		await Section.findByIdAndDelete(subSectionId);

// 		// TODO : Do we need to delete the entry from course schema ??

// 		return res.status(200).json({
// 			success: true,
// 			msg: "subsection deleted successfully",
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		return res.status(500).json({
// 			success: false,
// 			msg: "Error in deleting subsection",
// 		});
// 	}
// };
