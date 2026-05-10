# Team Task Manager (MERN + Tailwind)

A full-stack task management app where teams can create projects, assign tasks, track status, and monitor overdue work with role-based access (`admin` / `member`).

## Features

- Authentication: signup/login with JWT
- Role-based access control
  - Admin: create projects and tasks, assign members
  - Member: update status of assigned tasks
- Project and task management
- Dashboard with task summary:
  - total, todo, in progress, done, overdue
- MERN stack + Tailwind UI

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, Axios
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT
- Deployment target: Railway

## Project Structure

```text
Team_task_management/
  backend/
    src/
      config/
      middleware/
      models/
      routes/
    server.js
  frontend/
    src/
      App.jsx
      main.jsx
      index.css
```

## Local Setup

### 1) Prerequisites

- Node.js 18+
- npm
- MongoDB local instance or MongoDB Atlas

### 2) Backend setup

```bash
cd Team_task_management/backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/team_task_manager
JWT_SECRET=replace_with_strong_secret
CLIENT_URLS=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

### 3) Frontend setup

```bash
cd Team_task_management/frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev -- --host
```

Open: `http://localhost:5173`

## API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)
- `GET /api/auth/users` (admin only)

### Projects
- `GET /api/projects` (protected)
- `POST /api/projects` (admin only)

### Tasks
- `GET /api/tasks` (protected)
- `POST /api/tasks` (admin only)
- `PATCH /api/tasks/:id/status` (admin or assigned member)

### Dashboard
- `GET /api/dashboard` (protected)

## Railway Deployment (Step-by-step)

### 1) Push to GitHub

Push the latest code from your local machine to GitHub.

### 2) Create MongoDB Atlas DB

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create database user/password.
3. Add network access.
4. Copy connection string and replace DB name with `team_task_manager`.

### 3) Deploy Backend on Railway

1. Open [Railway](https://railway.app/) -> **New Project**.
2. Choose **Deploy from GitHub** and select your repo.
3. Configure backend service:
   - Root Directory: `Team_task_management/backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables:
   - `MONGO_URI=<your atlas uri>`
   - `JWT_SECRET=<strong secret>`
   - `CLIENT_URLS=https://your-frontend-domain.up.railway.app,http://localhost:5173`
5. Deploy and copy backend public URL.

### 4) Deploy Frontend on Railway

1. Create another service from same GitHub repo.
2. Configure frontend service:
   - Root Directory: `Team_task_management/frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview -- --host 0.0.0.0 --port $PORT`
3. Add environment variable:
   - `VITE_API_URL=https://your-backend-domain.up.railway.app/api`
4. Deploy and copy frontend URL.

### 5) Final cross-check

- Frontend can signup/login.
- Admin can create project/task.
- Member can update assigned task status.
- Dashboard updates.
- No CORS errors in browser console.

## Submission Checklist

- Live application URL
- GitHub repository URL
- This README
- 2-5 minute demo video
