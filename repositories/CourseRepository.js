const Course = require("../models/Course");

class CourseRepository {
  constructor() {
    this.cache = null;
    this.cacheExpiry = null;
    this.CACHE_TTL = 5 * 60 * 1000; 
    this.io = null; 
  }

  setIo(ioInstance) {
    this.io = ioInstance;
  }

  async create(data) {
    try {
      const newCourse = await Course.create(data);

      this.cache = null; 
      console.log("Course created and cache cleared");

      if (this.io) {
        this.io.emit("notification", `New course added: ${data.name}`);
      } else {
        console.warn("Socket.io instance not set");
      }

      return newCourse;
    } catch (error) {
      console.error("Error creating course:", error);
      throw new Error("Failed to create course");
    }
  }
  async getAll() {
    if (this.cache && Date.now() < this.cacheExpiry) {
      console.log("Returning courses from cache");
      return this.cache;
    }

    const courses = await Course.findAll();
    this.cache = courses;
    this.cacheExpiry = Date.now() + this.CACHE_TTL;
    console.log("Courses fetched from database and cache updated");
    return courses;
  }
  async getById(id) {
    try {
      const course = await Course.findByPk(id);
      return course || null;
    } catch (error) {
      console.error("Error fetching course by id:", error);
      throw new Error("Failed to fetch course by id");
    }
  }
}

module.exports = new CourseRepository();
