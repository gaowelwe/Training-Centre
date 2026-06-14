const Course = require("../models/Course");
const courseRepository = require("../repositories/CourseRepository");
const UserRepository = require("../repositories/UserRepository");
const bcrypt = require("bcrypt");
const userController = require("../controllers/userController");


let courses = [
  { id: 1, name: "Computer Literacy" },
  { id: 2, name: "Web Development" },
  { id: 3, name: "Business Skills" }
];

exports.listAPI = (req, res) => {
  res.status(200).json(courses);
};

exports.createAPI = (req, res) => {
  const newCourse = { id: Date.now(), name: req.body.name };
  courses.push(newCourse);
  res.status(201).json(newCourse);
};

exports.updateAPI = (req, res) => {
  const course = courses.find(c => c.id == req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  course.name = req.body.name;
  res.status(200).json(course);
};

exports.deleteAPI = (req, res) => {
  const index = courses.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Course not found" });
  const deleted = courses.splice(index, 1);
  res.status(200).json(deleted[0]);
};


exports.list = async (req, res) => {
    try {

        const courses = await courseRepository.getAll();

        res.render("courses", {
            title: "Available Courses",
            courses: courses
        });

    } catch (error) {

        console.error("Failed to fetch courses:", error);

        res.render("courses", {
            title: "Available Courses",
            courses: []
        });

    }
};

exports.details = async (req, res) => {
  try {
    const id = req.params.id;

    const course = await courseRepository.getById(id);

    if (!course) {
      return res.status(404).render("courseDetails", {
        title: "Course Not Found",
        course: null
      });
    }

    const discountedFee = Number(Course.calculateDiscount(course.fee, 10)).toFixed(2);

    res.render("courseDetails", {
      title: `${course.name} - Details`,
      course,
      discountedFee
    });
  } catch (error) {
    console.error("Failed to load course details:", error);
    res.status(500).render("courseDetails", {
      title: "Error",
      course: null
    });
  }
};

exports.showCourseForm = (req, res) => {
    res.render("courseForm", {
        title: "Add new course",
        errors: [],
        oldInput: {}
    });
};

exports.createCourse = async (req, res) => {
  try {
    const { name, fee, category } = req.body;

    if (!name || !fee || !category) {
      return res.render("courseForm", {
        title: "Add New Course",
        errors: ["All fields are required."],
        oldInput: req.body
      });
    }

    const course = await courseRepository.create({ name, fee, category });

    const discountedFee = (Number(course.fee) * 0.9).toFixed(2);

    res.render("courseSuccess", {
      title: "Course Created",
      course,
      discountedFee
    });
  } catch (error) {
    console.error("Course creation failed:", error);
    res.render("courseForm", {
      title: "Add New Course",
      errors: ["Something went wrong. Please try again."],
      oldInput: req.body
    });
  }
};

exports.index = (req, res) => {
    res.render("index", { title: "Home" });
};

// Show login form
exports.showLoginForm = (req, res) => {
    res.render("login", {
        title: "Login",
        errors: {},
        oldInput: {}
    });
};
exports.handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const errors = {};

    if (!email || email.trim() === "") {
        errors.email = "Email or username is required";
    }
    if (!password || password === "") {
        errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
        return res.render("login", {
            title: "Login",
            errors,
            oldInput: { email }
        });
    }

    const user = await UserRepository.findByEmail(email);

    if (!user) {
        console.warn("Login failed: user not found");
        return res.render("login", {
            title: "Login",
            errors: { general: "Invalid login details" },
            oldInput: { email }
        });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        console.warn("Login failed: incorrect password");
        return res.render("login", {
            title: "Login",
            errors: { general: "Invalid login details" },
            oldInput: { email }
        });
    }

    req.session.user_email = user.email;
    res.redirect("/");
};

exports.seedAdminUser = async (req, res) => {
    return await UserRepository.create({
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10)
    });
};

exports.showEnrolForm = async (req, res) => {
    try {
        const id = req.params.id;
        const course = await courseRepository.getById(id);

        if (!course) {
            return res.status(404).render("404", {
                title: "Course Not Found"
            });
        }

        res.render("enrolForm", {
            title: `Enrol in ${course.name}`,
            course,
            errors: [],
            oldInput: {}
        });
    } catch (error) {
        console.error("Failed to load enrol form:", error);
        res.status(500).render("404", {
            title: "Error"
        });
    }
};

exports.handleEnrol = async (req, res) => {
    try {
        const courseId = req.params.id;
        const { firstName, lastName, email } = req.body;

        const errors = [];
        if (!firstName || firstName.trim() === "") {
            errors.push("First name is required");
        }
        if (!lastName || lastName.trim() === "") {
            errors.push("Last name is required");
        }
        if (!email || email.trim() === "") {
            errors.push("Email is required");
        }

        if (errors.length > 0) {
            const course = await courseRepository.getById(courseId);
            return res.render("enrolForm", {
                title: `Enrol in ${course.name}`,
                course,
                errors,
                oldInput: { firstName, lastName, email }
            });
        }

        const course = await courseRepository.getById(courseId);
        const discountedFee = (Number(course.fee) * 0.9).toFixed(2);
        
        res.render("courseSuccess", {
            title: "Enrolment Successful",
            message: `You have successfully enrolled in ${course.name}`,
            course,
            discountedFee
        });
    } catch (error) {
        console.error("Enrolment failed:", error);
        res.status(500).render("404", {
            title: "Error"
        });
    }
};




