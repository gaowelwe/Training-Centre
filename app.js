require("dotenv").config();

const express = require("express");
const path = require("path");
const compression = require("compression");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const { requireAuth, logExecutionTime } = require("./middleware/authMiddleware");
const homeRoutes = require("./routes/homeRoutes");
const courseRoutes = require("./routes/courseRoutes");
const sequelize = require("./config/database"); //#DB
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);
const courseRepo = require("./repositories/CourseRepository");
const weatherRoutes = require("./routes/weatherRoutes");
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET is required. Set it in .env or the environment.');
}

courseRepo.setIo(io);

app.use(weatherRoutes);

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.post("/enrol/:id", (req, res) => {
  if (!req.session.enrolments) {
    req.session.enrolments = [];
  }
  req.session.enrolments.push(req.params.id);
  res.send("Course added to enrolment list.");
});

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/main");

app.use(compression()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(logExecutionTime);

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

app.use("/", homeRoutes);
app.use("/", courseRoutes);

app.get("/dashboard", requireAuth, (req, res) => {
  res.send("Welcome to the Dashboard");
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  
  if (process.env.NODE_ENV === 'production') {
    console.error(`[ERROR] ${status}: ${message}`);
  } else {
    console.error(err);
  }
  
  res.status(status).json({
    error: {
      status: status,
      message: process.env.NODE_ENV === 'production' ? "An error occurred" : message
    }
  });
});

io.on("connection", (socket) => {
  console.log("Client connected");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

sequelize.authenticate()
  .then(() => console.log("Connected to SQL Server"))
  .catch((error) => console.error("Database connection failed:", error));

sequelize.sync()
  .then(() => console.log("Tables created"))
  .catch(err => console.error(err));

module.exports = { app, server, io };

