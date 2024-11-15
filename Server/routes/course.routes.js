// Import the required modules
const express = require("express");
const { authN, isInstructor, isAdmin, isStudent } = require("../middlewares/auth.middlewares");
const { createCourse, getAllCourses, getCourseDetails, deleteCourse, getFullCourseDetails, editCourse, getInstructorCourses } = require("../controllers/course.controllers");
const { createSection, updateSection, deleteSection } = require("../controllers/section.controllers");
const { updateSubSection,deleteSubSection, createSubSection} = require("../controllers/subsection.controllers");
const { createCategory, showAllCategories, categoryPageDetails } = require("../controllers/category.controllers");
const { createRatingsAndReviews, getAverageRating, getAllRatings } = require("../controllers/ratingAndReview.controllers");
const router = express.Router();


router.post("/addSection", authN, isInstructor, createSection);
router.post("/updateSection", authN, isInstructor, updateSection);
router.post("/deleteSection", authN, isInstructor, deleteSection);

router.post("/addSubSection", authN, isInstructor, createSubSection);
router.post("/updateSubSection", authN, isInstructor, updateSubSection);
router.post("/deleteSubSection", authN, isInstructor, deleteSubSection);

router.post("/createCourse", authN, isInstructor, createCourse);
router.get("/getAllCourses", getAllCourses);
router.post("/getCourseDetails", getCourseDetails);
router.delete("/deleteCourse", deleteCourse);
router.post("/getFullCourseDetails", authN, getFullCourseDetails);
router.post("/editCourse", authN, isInstructor, editCourse);
router.get("/getInstructorCourses", authN, isInstructor, getInstructorCourses);
// router.post("/updateCourseProgress", authN, isStudent, updateCourseProgress);


// TODO: Put IsAdmin Middleware here
router.post("/createCategory", authN, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.get("/categoryPageDetails", categoryPageDetails);


router.post("/createRatingsAndReviews", authN, isStudent, createRatingsAndReviews);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatings);

module.exports = router;
