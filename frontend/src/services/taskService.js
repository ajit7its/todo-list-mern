import api from "./api/axiosClient";

const TASK_URL = "/tasks";

export const getTasks = () => api.get(TASK_URL).then(res => res.data);

export const createTask = (taskData) =>
  api.post(TASK_URL, taskData).then(res => res.data);

export const updateTask = (id, updates) =>
  api.put(`${TASK_URL}/${id}`, updates).then(res => res.data);

export const deleteTask = (id) =>
  api.delete(`${TASK_URL}/${id}`).then(res => res.data);
