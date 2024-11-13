const Category = require("../models/category.models");

exports.createCategory = async (req, res) => {
	try {
		//fetch data
		//validate
		//create entry in DB
		//return res

		//courses data will be added when we'll create course

		const { name, description } = req.body;
		if (!name || !description) {
			return res.status(401).json({
				success: false,
				msg: "All fields are required",
			});
		}

		const response = await Category.create({ name, description });
		console.log("Category created resp : ", response);

		return res.status(200).json({
			success: true,
			msg: "Category created successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: "Something went wrong, in creating Category",
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
		const resp = await Category.find({}, { name: true, description: true });

		return res.status(200).json({
			success: true,
			Categories: resp,
			msg: "Category created successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: "Something went wrong, in fetching all Categorys",
		});
	}
};
