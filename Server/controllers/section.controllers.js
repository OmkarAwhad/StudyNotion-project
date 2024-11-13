const Section = require("../models/section.models");
const Course = require("../models/course.models");

// we know that in course model we are storing objectId of section
// while creating course we haven't stored any section objectId there
// therefore here we are going to first create the section and then add entry of its objectId in Course model
// update section
// delete section

exports.createSection = async (req, res) => {
	try {
		// fetch data {name}
		// validate
		// create entry in db
		// add objectId to Course
		// return resp

		const { sectionName, courseId } = req.body;

		if (!sectionName || !courseId) {
			return res.status(402).json({
				success: false,
				msg: "All fields are required",
			});
		}

		const response = await Section.create({ sectionName });

		await Course.findByIdAndUpdate(
			courseId,
			{ $push: { courseContent: response._id } },
			{ new: true }
		);
		// TODO : use populate

		return res.status(200).json({
			success: false,
			msg: "Section created successful",
			data: response,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			msg: "Error in creating section",
		});
	}
};

exports.updateSection = async (req, res) => {
	try {
		//fetch data
		//validate
		//update data in Section model
		//return response

		const { updateSectionName, sectionId } = req.body;

		if (!updateSectionName || !sectionId) {
			return res.status(402).json({
				success: false,
				msg: "All fields are required",
			});
		}

		const response = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName: updateSectionName },
			{ new: true }
		);

		return res.status(200).json({
			success: true,
			data: response,
			msg: "Section updated successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			msg: "Error in updating section",
		});
	}
};

exports.deleteSection = async (req, res) => {
	try {
		//fetch id
		//validate
		//delete
		//return

		const { sectionId } = req.params;
		if (!sectionId) {
			return res.status(402).json({
				success: false,
				msg: "All fields are required",
			});
		}

		await Section.findByIdAndDelete(sectionId);

          // TODO : Do we need to delete the entry from course schema ??

		return res.status(200).json({
			success: true,
			msg: "Section deleted successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			msg: "Error in deleting section",
		});
	}
};

// TODO : getAllSectionDetails