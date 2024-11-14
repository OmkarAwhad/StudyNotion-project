// Import the required modules
const express = require("express");
const { authN, isInstructor } = require("../middlewares/auth.middlewares");
const { createCourse, getAllCourses, getCourseDetails } = require("../controllers/course.controllers");
const { createSection, updateSection, deleteSection } = require("../controllers/section.controllers");
const { updateSubSection,deleteSubSection, createSubSection} = require("../controllers/subsection.controllers");
const { createCategory, showAllCategories, categoryPageDetails } = require("../controllers/category.controllers");
const { createRatingsAndReviews, getAverageRating, getAllRatings } = require("../controllers/ratingAndReview.controllers");
const router = express.Router();

// Import the Controllers



// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", authN, isInstructor, createCourse);
//Add a Section to a Course
router.post("/addSection", authN, isInstructor, createSection);
// Update a Section
router.post("/updateSection", authN, isInstructor, updateSection);
// Delete a Section
router.post("/deleteSection", authN, isInstructor, deleteSection);
// Edit Sub Section
router.post("/updateSubSection", authN, isInstructor, updateSubSection);
// Delete Sub Section
router.post("/deleteSubSection", authN, isInstructor, deleteSubSection);
// Add a Sub Section to a Section
router.post("/addSubSection", authN, isInstructor, createSubSection);
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);
// Get Details for a Specific Courses
// router.post("/getFullCourseDetails", authN, getFullCourseDetails);
// Edit Course routes
// router.post("/editCourse", authN, isInstructor, editCourse);
// Get all Courses Under a Specific Instructor
// router.get("/getInstructorCourses", authN, isInstructor, getInstructorCourses);
// Delete a Course
// router.delete("/deleteCourse", deleteCourse);

// router.post("/updateCourseProgress", authN, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", authN, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRatingsAndReviews", authN, isStudent, createRatingsAndReviews);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatings);

module.exports = router;
