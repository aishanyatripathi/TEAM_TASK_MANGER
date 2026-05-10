# Demo Video Script (2-5 minutes)

Use this flow while recording your assignment demo.

## 0:00 - 0:20 Intro

- Show app title and live URL.
- Say: "This is a MERN Team Task Manager with role-based access (admin/member)."

## 0:20 - 1:00 Auth + Roles

- Signup as `Admin` (role: admin), then logout.
- Signup as `Member` (role: member), then logout.
- Login as admin.

## 1:00 - 2:00 Admin Flow

- Create a project.
- Create one or two tasks.
- Assign task(s) to member.
- Show tasks list and dashboard counters updating.

## 2:00 - 3:00 Member Flow

- Logout and login as member.
- Open task list.
- Change assigned task status from `todo` -> `in_progress` -> `done`.
- Show access behavior: member can update status but not create projects/tasks.

## 3:00 - 3:40 Dashboard + Overdue

- Show dashboard cards (`total`, `todo`, `inProgress`, `done`, `overdue`).
- Mention due date logic for overdue tasks.

## 3:40 - 4:20 Code + Deployment Proof

- Show GitHub repo quickly.
- Show Railway dashboard with backend + frontend services.
- Show environment variables (keys only, do not show secret values).

## 4:20 - 5:00 Wrap-up

- Summarize:
  - JWT authentication
  - Role-based authorization
  - Project/task management
  - Dashboard tracking
  - Live deployed app on Railway
