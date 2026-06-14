const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.get("/courses", courseController.list);
router.get("/courses/create", courseController.showCourseForm);
router.post("/courses/create", courseController.createCourse);
router.get("/courses/:id", courseController.details);
router.get("/courses/enrol/:id", courseController.showEnrolForm);
router.post("/courses/enrol/:id", courseController.handleEnrol);
router.get("/api/courses", courseController.listAPI);
router.post("/api/courses", courseController.createAPI);
router.put("/api/courses/:id", courseController.updateAPI);
router.delete("/api/courses/:id", courseController.deleteAPI);

module.exports = router;


