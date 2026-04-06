<<<<<<< HEAD
# 🚀 StudentCollab Platform

A full-stack web platform where engineering students from different colleges connect and collaborate on projects.

---

## 📁 Project Structure

```
student-collab-platform/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Request.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   └── requestController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   └── requestRoutes.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── services/
    │   │   └── api.js
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── ProjectCard.js
    │   │   ├── RequestCard.js
    │   │   ├── ProfileCard.js
    │   │   ├── SkillTag.js
    │   │   └── Modal.js
    │   ├── pages/
    │   │   ├── LandingPage.js
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   ├── DashboardPage.js
    │   │   ├── ProjectFeedPage.js
    │   │   ├── CreateProjectPage.js
    │   │   ├── ProjectDetailsPage.js
    │   │   ├── ProfilePage.js
    │   │   ├── UserProfilePage.js
    │   │   └── RequestsPage.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── tailwind.config.js
    ├── .env
    └── package.json
```

---

## ⚙️ Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Frontend     | React.js, Tailwind CSS, React Router, Axios |
| Backend      | Node.js, Express.js               |
| Database     | MongoDB, Mongoose                 |
| Auth         | JWT, bcryptjs                     |
| External API | GitHub REST API                   |

---

## 🛠️ Running Locally

### Prerequisites
- Node.js v18+
- MongoDB running locally on port `27017`

### Backend

```bash
cd backend
npm install
npm run dev
# Server starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm start
# App opens on http://localhost:3000
```

---

## 🌐 API Reference

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Users
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/users/profile` | ✅ | Get own profile |
| PUT | `/api/users/profile` | ✅ | Update own profile |
| GET | `/api/users/:id` | ❌ | Get any user's public profile |

### Projects
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/projects/create` | ✅ | Create new project |
| GET | `/api/projects` | ❌ | Get all open projects |
| GET | `/api/projects/:id` | ❌ | Get project by ID |
| PUT | `/api/projects/:id` | ✅ | Update project (owner only) |
| DELETE | `/api/projects/:id` | ✅ | Delete project (owner only) |

### Requests
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/requests/send` | ✅ | Send collaboration request |
| GET | `/api/requests/my` | ✅ | Get my sent requests |
| GET | `/api/requests/project/:projectId` | ✅ | Get requests for a project (owner only) |
| PUT | `/api/requests/accept/:requestId` | ✅ | Accept a request |
| PUT | `/api/requests/reject/:requestId` | ✅ | Reject a request |

---

## 🚀 Deployment

### Frontend → Vercel
1. Push frontend to GitHub
2. Import repo to [vercel.com](https://vercel.com)
3. Set environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`

### Backend → Render
1. Push backend to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set environment variables:
   - `MONGO_URI=mongodb+srv://...` (from MongoDB Atlas)
   - `JWT_SECRET=your_strong_secret_key`
   - `PORT=5000`

### Database → MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Whitelist all IPs: `0.0.0.0/0`
3. Copy connection string to `MONGO_URI`

---

## 🧩 Features

- ✅ JWT authentication (register / login / logout)
- ✅ Student profiles with skills, college, branch, bio
- ✅ GitHub repository integration
- ✅ Project posting with tech stack & required skills
- ✅ Collaboration request system (send / accept / reject)
- ✅ Dashboard with stats and project overview
- ✅ Project feed with search and status filter
- ✅ Public user profile pages
- ✅ Requests dashboard with sent/incoming tabs
- ✅ Responsive dark-themed UI

## 🔮 Future Features (Design Ready)
- Real-time notifications via Socket.io
- AI teammate matching
- Blockchain project ownership verification
- Student reputation/badge system
=======
# student-collab-platform
>>>>>>> c5c804a5834b2e045b8bde2ec55aa7fad9da6686
