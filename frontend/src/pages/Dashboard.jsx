import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

// 🎨 Priority-based card color system
const getPriorityCardStyle = (priority) => {
  switch (priority) {
    case "high":
      return {
        background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        border: "1px solid #f8a5b0",
      };
    case "medium":
      return {
        background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
        border: "1px solid #e8bff5",
      };
    case "low":
    default:
      return {
        background: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
        border: "1px solid #b6f3bb",
      };
  }
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);

  // Add Task Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("low");
  const [taskStatus, setTaskStatus] = useState("pending");
  const [taskDueDate, setTaskDueDate] = useState("");

  // Edit Task Modal States
  const [editModal, setEditModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const res = await getTasks();
    setTasks(res);
  };

  // Add Task
  const handleAdd = async () => {
    if (!taskTitle.trim()) {
      alert("Task title is required");
      return;
    }

    const newTask = {
      title: taskTitle,
      description: taskDescription,
      priority: taskPriority,
      status: taskStatus,
      dueDate: taskDueDate || null,
    };

    const created = await createTask(newTask);
    setTasks([created, ...tasks]);

    // Reset + Close
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("low");
    setTaskStatus("pending");
    setTaskDueDate("");
    setShowAddModal(false);
  };

  // Edit Task
  const handleUpdate = async () => {
    const updated = await updateTask(editTask._id, editTask);

    setTasks(tasks.map((t) => (t._id === editTask._id ? updated : t)));
    setEditModal(false);
  };

  // Quick Status Update Buttons
  const updateStatus = async (taskId, newStatus) => {
    const updated = await updateTask(taskId, { status: newStatus });
    setTasks(tasks.map((t) => (t._id === taskId ? updated : t)));
  };

  // Delete
  const removeTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    await deleteTask(taskId);
    setTasks(tasks.filter((t) => t._id !== taskId));
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar bg-light shadow-sm">
        <div className="container d-flex justify-content-between py-2">
          <h4 className="fw-bold text-primary">To-Do Dashboard</h4>

          <div>
            <span className="me-3 fw-semibold">Hello, {user?.name}</span>
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* TOP BAR */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-dark">Your Tasks</h4>

          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => setShowAddModal(true)}
          >
            + Add Task
          </button>
        </div>

        {/* TASK LIST */}
        <div className="row g-4">
          {tasks.map((task) => (
            <div className="col-md-4" key={task._id}>
              <div
                className="p-4 rounded-4 shadow"
                style={{
                  ...getPriorityCardStyle(task.priority),
                  borderRadius: "18px",
                }}
              >
                {/* TITLE */}
                <h5 className="fw-bold text-dark">{task.title}</h5>

                {/* DESCRIPTION */}
                <p className="text-dark">{task.description}</p>

                {/* STATUS BADGE */}
                <div className="mb-2">
                  <span
                    className={`badge px-3 py-2 rounded-pill fs-6 ${
                      task.status === "completed"
                        ? "bg-success"
                        : task.status === "in-progress"
                        ? "bg-primary"
                        : "bg-secondary"
                    }`}
                  >
                    {task.status.toUpperCase()}
                  </span>
                </div>

                {/* DUE DATE */}
                {task.dueDate && (
                  <small className="text-dark d-block mb-3">
                    <strong>Due:</strong>{" "}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </small>
                )}

                {/* MAIN ACTIONS */}
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-outline-primary rounded-pill px-4"
                    onClick={() => {
                      setEditTask(task);
                      setEditModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger rounded-pill px-4"
                    onClick={() => removeTask(task._id)}
                  >
                    Delete
                  </button>
                </div>

                {/* QUICK STATUS BUTTONS */}
                <div className="d-flex justify-content-center gap-2 mt-3">
                  <button
                    className="btn btn-sm btn-outline-success rounded-pill"
                    onClick={() => updateStatus(task._id, "completed")}
                  >
                    ✓ Done
                  </button>

                  <button
                    className="btn btn-sm btn-outline-primary rounded-pill"
                    onClick={() => updateStatus(task._id, "in-progress")}
                  >
                    ▶ Progress
                  </button>

                  <button
                    className="btn btn-sm btn-outline-secondary rounded-pill"
                    onClick={() => updateStatus(task._id, "pending")}
                  >
                    • Pending
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD TASK MODAL */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 rounded-4">
              <h5 className="fw-bold mb-3">Create New Task</h5>

              <input
                className="form-control mb-2 p-3"
                placeholder="Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />

              <textarea
                className="form-control mb-2 p-3"
                placeholder="Description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />

              <select
                className="form-select mb-2 p-3"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select
                className="form-select mb-2 p-3"
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="form-control mb-3 p-3"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
              />

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary rounded-pill px-4"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary rounded-pill px-4"
                  onClick={handleAdd}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TASK MODAL */}
      {editModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 rounded-4">
              <h5 className="fw-bold mb-3">Edit Task</h5>

              <input
                className="form-control mb-2 p-3"
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
              />

              <textarea
                className="form-control mb-2 p-3"
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
              />

              <select
                className="form-select mb-2 p-3"
                value={editTask.priority}
                onChange={(e) =>
                  setEditTask({ ...editTask, priority: e.target.value })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select
                className="form-select mb-2 p-3"
                value={editTask.status}
                onChange={(e) =>
                  setEditTask({ ...editTask, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="form-control mb-3 p-3"
                value={editTask.dueDate?.split("T")[0] || ""}
                onChange={(e) =>
                  setEditTask({ ...editTask, dueDate: e.target.value })
                }
              />

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary rounded-pill px-4"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary rounded-pill px-4"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
