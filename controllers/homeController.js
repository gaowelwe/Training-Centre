const UserRepository = require("../repositories/UserRepository");
const bcrypt = require("bcrypt");

exports.index = (req, res) => {
    res.render("index", { title: "Home" });
};

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
        return res.render("login", {
            title: "Login",
            errors: { general: "Invalid login details" },
            oldInput: { email }
        });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.render("login", {
            title: "Login",
            errors: { general: "Invalid login details" },
            oldInput: { email }
        });
    }

    req.session.user_email = user.email;
    res.redirect("/");
};

exports.index = (req, res) => {
  res.render("index", { title: "Home" });
};
