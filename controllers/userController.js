const UserRepository = require("../repositories/UserRepository");
const bcrypt = require("bcrypt");

exports.seedAdminUser = async (req, res) => {
  await UserRepository.create({
    email: "admin@example.com",
    password: await bcrypt.hash("admin123", 10)
  });
  res.send("Admin user created");
};

exports.handleLogin = async (req, res) => {
 
};
