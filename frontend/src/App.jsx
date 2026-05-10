import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_URL });

const getToken = () => localStorage.getItem("ttm_token");
const getUser = () => {
  const raw = localStorage.getItem("ttm_user");
  return raw ? JSON.parse(raw) : null;
};

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [projectForm, setProjectForm] = useState({ name: "", description: "", memberIds: [] });
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    dueDate: "",
  });
  const [message, setMessage] = useState("");

  const authHeader = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  const isAdmin = user?.role === "admin";

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const loadData = async () => {
    if (!token) return;
    try {
      const [projectsRes, tasksRes, dashboardRes] = await Promise.all([
        api.get("/projects", authHeader),
        api.get("/tasks", authHeader),
        api.get("/dashboard", authHeader),
      ]);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
      setDashboard(dashboardRes.data);
    } catch (error) {
      showMessage(error.response?.data?.message || "Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = authMode === "login" ? "/auth/login" : "/auth/signup";
      const payload =
        authMode === "login"
          ? { email: authForm.email, password: authForm.password }
          : authForm;

      const { data } = await api.post(endpoint, payload);
      localStorage.setItem("ttm_token", data.token);
      localStorage.setItem("ttm_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      showMessage("Authenticated successfully");
    } catch (error) {
      showMessage(error.response?.data?.message || "Authentication failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("ttm_token");
    localStorage.removeItem("ttm_user");
    setUser(null);
    setToken("");
    setProjects([]);
    setTasks([]);
    setDashboard(null);
  };

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const { data } = await api.get("/auth/me", authHeader);
      setUser(data);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects", projectForm, authHeader);
      setProjectForm({ name: "", description: "", memberIds: [] });
      showMessage("Project created");
      loadData();
    } catch (error) {
      showMessage(error.response?.data?.message || "Project creation failed");
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", taskForm, authHeader);
      setTaskForm({ title: "", description: "", projectId: "", assignedTo: "", dueDate: "" });
      showMessage("Task created");
      loadData();
    } catch (error) {
      showMessage(error.response?.data?.message || "Task creation failed");
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status }, authHeader);
      loadData();
    } catch (error) {
      showMessage(error.response?.data?.message || "Task update failed");
    }
  };

  useEffect(() => {
    const list = async () => {
      if (!token || !isAdmin) return;
      try {
        const { data } = await api.get("/auth/users", authHeader);
        setUsers(data);
      } catch {
        setUsers([]);
      }
    };
    list();
  }, [token, isAdmin]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto mt-16 max-w-md rounded-xl bg-white p-6 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">Team Task Manager</h1>
          <p className="mb-4 text-sm text-gray-600">MERN + Tailwind (Admin/Member access)</p>
          <form onSubmit={handleAuthSubmit} className="space-y-3">
            {authMode === "signup" && (
              <input
                className="w-full rounded border p-2"
                placeholder="Name"
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                required
              />
            )}
            <input
              className="w-full rounded border p-2"
              placeholder="Email"
              type="email"
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              required
            />
            <input
              className="w-full rounded border p-2"
              placeholder="Password"
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              required
            />
            {authMode === "signup" && (
              <select
                className="w-full rounded border p-2"
                value={authForm.role}
                onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            )}
            <button className="w-full rounded bg-blue-600 p-2 font-semibold text-white">
              {authMode === "login" ? "Login" : "Signup"}
            </button>
          </form>
          <button
            className="mt-3 text-sm text-blue-600"
            onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
          >
            {authMode === "login" ? "No account? Signup" : "Already have account? Login"}
          </button>
          {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow">
          <div>
            <h1 className="text-2xl font-bold">Team Task Manager</h1>
            <p className="text-sm text-gray-600">
              Welcome {user?.name} ({user?.role})
            </p>
          </div>
          <button onClick={logout} className="rounded bg-red-600 px-4 py-2 text-white">
            Logout
          </button>
        </div>

        {dashboard && (
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
            {Object.entries(dashboard).map(([key, value]) => (
              <div key={key} className="rounded-xl bg-white p-3 text-center shadow">
                <p className="text-xs uppercase text-gray-500">{key}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {isAdmin && (
            <form onSubmit={createProject} className="rounded-xl bg-white p-4 shadow space-y-2">
              <h2 className="text-lg font-semibold">Create Project</h2>
              <input
                className="w-full rounded border p-2"
                placeholder="Project name"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                required
              />
              <textarea
                className="w-full rounded border p-2"
                placeholder="Description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              />
              <button className="rounded bg-blue-600 px-4 py-2 text-white">Create</button>
            </form>
          )}

          {isAdmin && (
            <form onSubmit={createTask} className="rounded-xl bg-white p-4 shadow space-y-2">
              <h2 className="text-lg font-semibold">Create Task</h2>
              <input
                className="w-full rounded border p-2"
                placeholder="Task title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                required
              />
              <textarea
                className="w-full rounded border p-2"
                placeholder="Task description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              />
              <select
                className="w-full rounded border p-2"
                value={taskForm.projectId}
                onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
                required
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full rounded border p-2"
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                required
              >
                <option value="">Assign to member</option>
                {users.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded border p-2"
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              />
              <button className="rounded bg-blue-600 px-4 py-2 text-white">Create Task</button>
            </form>
          )}
        </div>

        <div className="mt-6 rounded-xl bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">Tasks</h2>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task._id} className="rounded border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-sm text-gray-600">
                      Project: {task.project?.name} | Assigned: {task.assignedTo?.name}
                    </p>
                  </div>
                  <select
                    className="rounded border p-1"
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            ))}
            {tasks.length === 0 && <p className="text-sm text-gray-500">No tasks available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
