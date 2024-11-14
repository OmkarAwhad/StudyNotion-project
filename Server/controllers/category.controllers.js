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
		const resp = await Category.find(
			{},
			{ name: true, description: true }
		);

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

exports.categoryPageDetails = async (req, res) => {
	try {
		//get category id
		//fetch all courses respective to that category id
		//validation
		//get courses for diff categories
		//get top selling courses
		//return resp

		const { categoryId } = req.body;

		const selectedCategory = await Category.findById(categoryId)
			.populate("courses")
			.exec();
		if (!selectedCategory) {
			return res.status(402).json({
				success: false,
				msg: "Data not found",
			});
		}

		const diffCategory = await Category.find({ _id: { $ne: categoryId } })
			.populate("courses")
			.exec();

		// TODO : Top selling
		const allCategories = await Category.find()
			.populate({
				path: "courses",
				match: { status: "Published" },
				populate: {
					path: "instructor",
				},
			})
			.exec();
		const allCourses = allCategories.flatMap((category) => category.courses );
		const mostSellingCourses = allCourses
			.sort((a, b) => b.sold - a.sold)
			.slice(0, 10);
		// console.log("mostSellingCourses COURSE", mostSellingCourses)

		return res.status(200).json({
			success: true,
			data: {
				selectedCategory,
				diffCategory,
				mostSellingCourses
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(402).json({
			success: false,
			msg: "Error in category Page details",
		});
	}
};
