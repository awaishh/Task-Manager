# Prose & Process

A full-stack project management application built with Node.js, Express, MongoDB, and React. It supports team collaboration with role-based access, task tracking, notes, and a complete authentication system including email verification and password reset.

---

## Folder Structure

```
prose-and-process/
├── backend/
│   ├── public/
│   │   └── temp/                  # Temporary file uploads (multer)
│   └── src/
│       ├── controllers/
│       │   ├── auth.controllers.js
│       │   ├── healthcheck.controllers.js
│       │   ├── note.controllers.js
│       │   ├── project.controllers.js
│       │   └── task.controllers.js
│       ├── db/
│       │   └── index.js           # MongoDB connection
│       ├── middlewares/
│       │   ├── auth.middleware.js  # JWT verification, role checks
│       │   ├── multer.middleware.js
│       │   └── validator.middleware.js
│       ├── models/
│       │   ├── note.models.js
│       │   ├── project.models.js
│       │   ├── projectmember.models.js
│       │   ├── subtask.models.js
│       │   ├── task.models.js
│       │   └── user.models.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── healthcheck.routes.js
│       │   ├── note.routes.js
│       │   ├── project.routes.js
│       │   └── task.routes.js
│       ├── utils/
│       │   ├── api-error.js
│       │   ├── api-response.js
│       │   ├── async-handler.js
│       │   ├── cloudinary.js
│       │   └── mail.js
│       ├── validators/
│       │   └── index.js
│       ├── app.js
│       ├── constants.js
│       └── index.js
├── frontend/
│   └── src/
│       ├── api/
│       │   ├── axios.js
│       │   ├── notes.js
│       │   ├── projects.js
│       │   └── tasks.js
│       ├── components/
│       │   ├── Btn.jsx
│       │   ├── Layout.jsx
│       │   ├── MembersTab.jsx
│       │   ├── Modal.jsx
│       │   ├── NotesTab.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── TaskDetail.jsx
│       │   └── TasksTab.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── ProjectDetail.jsx
│       │   ├── ProjectSettings.jsx
│       │   ├── Projects.jsx
│       │   ├── Register.jsx
│       │   ├── ResetPassword.jsx
│       │   └── VerifyEmail.jsx
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
└── README.md
```

---

## Features

### Authentication
- User registration with email, username, and password
- Email verification required before login (token expires in 20 minutes)
- Resend verification email
- Login with email or username
- Logout with cookie clearing
- Forgot password — sends reset link to email
- Reset password via token link (expires in 20 minutes)
- Change password (authenticated)
- JWT access tokens (1 day) and refresh tokens (7 days)
- Refresh token rotation

### Projects
- Create, read, update, delete projects
- Each project creator is automatically assigned the admin role
- View all projects you are a member of

### Team Members
- Add members to a project by email
- Assign roles: admin, project-admin, member
- Update member roles
- Remove members from a project

### Tasks
- Create tasks with title, description, status, and assigned user
- File attachments via Cloudinary (up to 5 files per task)
- Update task status: todo, in-progress, done
- Delete tasks
- Filter tasks by status
- Subtasks — add, toggle completion, delete

### Notes
- Create project notes with title and content
- Edit and delete notes
- Notes are scoped to a project

### Access Control
- All project routes require authentication
- Role-based middleware: admin, project-admin, member
- Members can view tasks and notes but cannot create or delete
- Only admins can manage members and project settings

---

## Tech Stack

**Backend**
- Node.js with Express 5
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer with Gmail SMTP for emails
- Mailgen for HTML email templates
- Multer for file uploads
- Cloudinary for file storage
- express-validator for input validation

**Frontend**
- React 19 with Vite
- React Router v7
- Axios
- Tailwind CSS v4

---

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=8000
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

MAILTRAP_SMTP_HOST=smtp.gmail.com
MAILTRAP_SMTP_PORT=465
MAILTRAP_SMTP_USER=your_gmail@gmail.com
MAILTRAP_SMTP_PASS=your_gmail_app_password

FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

For Gmail, you need to enable 2-Step Verification on your Google account and generate an App Password at myaccount.google.com/apppasswords.

---

## Running the Project

**Prerequisites**
- Node.js 18 or higher
- MongoDB Atlas account or local MongoDB instance
- Gmail account with App Password configured

**1. Clone the repository**

```bash
git clone <your-repo-url>
cd udemybackend
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd frontend
npm install
```

**4. Configure environment variables**

Copy the environment variables listed above into `backend/.env` and fill in your values.

**5. Run the backend**

```bash
cd backend
npm run dev
```

The backend runs on `http://localhost:8000`.

**6. Run the frontend**

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173`.

---

## API Reference

Base URL: `http://localhost:8000/api/v1`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | No | Register a new user |
| POST | /auth/login | No | Login |
| POST | /auth/logout | Yes | Logout |
| GET | /auth/verify-email/:token | No | Verify email |
| POST | /auth/resend-email-verification | Yes | Resend verification email |
| POST | /auth/forgot-password | No | Request password reset |
| POST | /auth/reset-password/:token | No | Reset password |
| POST | /auth/refresh-token | No | Refresh access token |
| GET | /auth/current-user | Yes | Get current user |
| POST | /auth/change-password | Yes | Change password |

### Projects

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | /projects | Member | Get all projects |
| POST | /projects | Member | Create project |
| GET | /projects/:id | Member | Get project by ID |
| PUT | /projects/:id | Admin | Update project |
| DELETE | /projects/:id | Admin | Delete project |
| GET | /projects/:id/members | Member | Get members |
| POST | /projects/:id/members | Admin | Add member |
| PUT | /projects/:id/members/:userId | Admin | Update member role |
| DELETE | /projects/:id/members/:userId | Admin | Remove member |

### Tasks

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | /tasks/:projectId | Member | Get all tasks |
| POST | /tasks/:projectId | Admin/Project-Admin | Create task |
| GET | /tasks/:projectId/t/:taskId | Member | Get task details |
| PUT | /tasks/:projectId/t/:taskId | Admin/Project-Admin | Update task |
| DELETE | /tasks/:projectId/t/:taskId | Admin/Project-Admin | Delete task |
| POST | /tasks/:projectId/t/:taskId/subtasks | Admin/Project-Admin | Create subtask |
| PUT | /tasks/:projectId/st/:subTaskId | Member | Update subtask |
| DELETE | /tasks/:projectId/st/:subTaskId | Admin/Project-Admin | Delete subtask |

### Notes

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | /notes/:projectId | Member | Get all notes |
| POST | /notes/:projectId | Admin | Create note |
| GET | /notes/:projectId/n/:noteId | Member | Get note by ID |
| PUT | /notes/:projectId/n/:noteId | Admin | Update note |
| DELETE | /notes/:projectId/n/:noteId | Admin | Delete note |

---

## Notes

- The `public/temp` directory is used by Multer for temporary file storage before uploading to Cloudinary. It is included in `.gitignore`.
- File attachments on tasks require a valid Cloudinary configuration. If Cloudinary is not configured, task creation without attachments still works.
- In production, set `NODE_ENV=production` to enable secure cookies over HTTPS.

---

Built with ❤️ by **Awaish**
