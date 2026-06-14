# Training Centre

A Node.js MVC application using Express, EJS, Sequelize, and SQLite. A full-featured training centre platform with course management, user authentication, session handling, real-time features, and weather integration.

**Author:** Pule Gaowelwe

## Overview

This app demonstrates a training centre website where:
- Users can view and enrol in courses
- Administrators can manage courses (create, read, update, delete)
- User sessions are managed securely with `express-session`
- Real-time notifications are powered by Socket.IO
- Static assets (CSS, JS, images) are properly served in production
- Configuration is environment-driven for flexible deployment

## Requirements

- Node.js 18+ (or compatible)
- npm

## Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update values as needed:
   ```bash
   cp .env.example .env
   ```

## Environment Variables

Configuration is loaded from environment variables using `dotenv`.

Required values:

- `NODE_ENV` - `development` or `production`
- `PORT` - port number the app listens on (default: 3000)
- `SESSION_SECRET` - session secret used by `express-session` (required; the app throws an error if missing)

Optional values:

- `DATABASE_URL` - custom SQLite database path. If unset, the app uses `./data/database.sqlite` by default.

Example `.env`:

```env
NODE_ENV=development
PORT=3000
SESSION_SECRET=local-development-secret-change-me
# DATABASE_URL=./data/database.sqlite
```

> **Security:** Do not commit `.env` to version control. Keep production secrets secure in your deployment host.

## Run Locally

Start the app:

```bash
npm start
```

Or in development mode with automatic reload using Node.js watch:

```bash
npm run dev
```

Or run tests:

```bash
npm test
```

Then visit `http://localhost:3000`.

## Project Structure

```
├── app.js                    # Main application entry point
├── gulpfile.js               # Build automation (CSS/SCSS)
├── package.json              # Dependencies and scripts
├── .env                       # Local environment variables (not committed)
├── .env.example               # Template for environment variables
├── README.md                  # This file
│
├── config/
│   └── database.js           # Sequelize configuration (SQLite)
│
├── controllers/
│   ├── homeController.js     # Home page and login handling
│   ├── courseController.js   # Course CRUD and enrolment logic
│   ├── userController.js     # User management (seed admin, etc.)
│   └── weatherController.js  # Weather API endpoint
│
├── middleware/
│   └── authMiddleware.js     # Session authentication and logging
│
├── models/
│   ├── User.js               # User schema (email, password)
│   └── Course.js             # Course schema (name, fee, category)
│
├── repositories/
│   ├── CourseRepository.js   # Course data access and Socket.IO integration
│   └── UserRepository.js     # User data access
│
├── routes/
│   ├── homeRoutes.js         # Home and login routes
│   ├── courseRoutes.js       # Course and enrolment routes
│   └── weatherRoutes.js      # Weather API routes
│
├── services/
│   └── weatherServices.js    # Weather API calls (Open-Meteo)
│
├── public/
│   ├── css/
│   │   └── site.css          # Compiled styles
│   └── js/
│       └── site.js           # Client-side JavaScript
│
├── views/
│   ├── layouts/
│   │   ├── layout.ejs        # Master layout
│   │   └── main.ejs          # Main template wrapper
│   ├── partials/
│   │   └── _courseItem.ejs   # Reusable course card component
│   ├── index.ejs             # Home page
│   ├── login.ejs             # Login form
│   ├── courses.ejs           # Course listing page
│   ├── courseDetails.ejs     # Individual course details
│   ├── courseForm.ejs        # Course creation/edit form
│   ├── enrolForm.ejs         # Course enrolment form
│   ├── courseSuccess.ejs     # Enrolment success page
│   └── 404.ejs               # Not found page
│
└── _tests_/
    └── filename.test.js      # Test suite
```

## Key Features

### Authentication & Sessions
- User login with email/password validation
- Session-based authentication using `express-session`
- Session secret stored securely in environment variables
- Protected routes (e.g., `/dashboard`)

### Course Management
- List all courses
- View course details with discounted pricing (10% off calculated via model method)
- Create new courses (form-based)
- Enrol in courses with session tracking
- RESTful API endpoints for programmatic access

### Real-Time Updates
- Socket.IO integration for live notifications
- CourseRepository manages Socket.IO connections

### Weather Integration
- Fetch current weather data via Open-Meteo API
- Available at `/api/weather`

### Static Assets
- GZIP compression enabled
- CSS served from `public/css/`
- JavaScript served from `public/js/`
- Images and other assets available in `public/`

### Logging & Monitoring
- Execution time logging for all requests
- Environment-specific logging (verbose in development, minimal in production)

## Routes

### Home & Authentication
- `GET /` - Home page
- `GET /login` - Login form
- `POST /login` - Handle login submission
- `GET /seedAdminUser` - Create admin user for testing

### Courses
- `GET /courses` - List all courses
- `GET /courses/:id` - View course details
- `GET /courses/create` - Show course creation form
- `POST /courses/create` - Create a new course
- `GET /courses/enrol/:id` - Show enrolment form
- `POST /courses/enrol/:id` - Handle course enrolment
- `GET /dashboard` - Protected dashboard (requires authentication)

### Course API (Programmatic Access)
- `GET /api/courses` - Get all courses (JSON)
- `POST /api/courses` - Create course (JSON)
- `PUT /api/courses/:id` - Update course (JSON)
- `DELETE /api/courses/:id` - Delete course (JSON)

### Weather
- `GET /api/weather` - Current weather data (Open-Meteo API)

## Database

Uses **SQLite** with Sequelize ORM.

### Models

**User**
- `id` - Primary key
- `email` - User email (required)
- `password` - Hashed password (required)
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

**Course**
- `id` - Primary key
- `name` - Course name (required)
- `fee` - Course fee (required)
- `category` - Course category (required)
- `createdAt` - Timestamp
- `updatedAt` - Timestamp
- Static method: `calculateDiscount(fee, percentage)` - Compute discounted price

### Database Location
- Development: `./data/database.sqlite`
- Test: In-memory (`:memory:`)
- Custom: Set `DATABASE_URL` in `.env`

## Middleware

### `authMiddleware.js`
- `requireAuth(req, res, next)` - Checks session for authenticated user; redirects to login if missing
- `logExecutionTime(req, res, next)` - Logs HTTP method, path, and response time for all requests

## Dependencies

### Production
- **express** - Web framework
- **express-ejs-layouts** - Template layout support
- **ejs** - HTML templating engine
- **express-session** - Session management
- **sequelize** - ORM for database access
- **sqlite3** - SQLite database driver
- **socket.io** - Real-time bidirectional communication
- **connect-flash** - Flash messages for user feedback
- **bcrypt** - Password hashing
- **axios** - HTTP client for external APIs
- **compression** - GZIP middleware
- **dotenv** - Environment variable loading

### Development & Testing
- **jest** - Testing framework
- **gulp** - Build task runner
- **gulp-sass** - SCSS compilation
- **gulp-clean-css** - CSS minification
- **sass** - SCSS processor

## Production Deployment

This project is ready for modern hosting platforms such as Render.

### Render Configuration

1. Create a Render account at https://dashboard.render.com/register
2. Push your project to GitHub
3. Create a new **Web Service** on Render
4. Connect your GitHub repository
5. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node app.js`
6. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=3000`
   - `SESSION_SECRET=<your-strong-production-secret>`
   - `DATABASE_URL=<optional-custom-path>`

Render automatically handles:
- Process management (no PM2 needed)
- Static asset serving
- HTTPS/SSL certificates
- Load balancing

**Note:** Render deployment requires a credit card, even for free tier testing. The task asks for configuration screenshots only.

## Testing

Run the test suite:

```bash
npm test
```

Test files are located in:
- `_tests_/filename.test.js`
- `tests/course.test.js`

## Security Best Practices

- Session secret stored in environment variables (not hardcoded)
- Passwords hashed using bcrypt
- Flash messages for safe user feedback
- GZIP compression enabled
- Environment-specific logging
- `.env` excluded from version control

## Development Commands

```bash
npm install     # Install dependencies
npm start       # Run production server
npm run dev     # Run with auto-reload (node --watch)
npm test        # Run test suite
```

## Notes

- `app.js` reads all configuration from `process.env` via dotenv
- `SESSION_SECRET` is required at startup; the app throws an error if missing
- The project includes `.env.example` to document all configuration values
- Static files are served from `public/` with Express static middleware
- All routes are modular and organized by feature in `/routes`
