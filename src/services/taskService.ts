import API from "./api";

const API_URL = 'http://localhost:3000';
export interface Task {
  id: number;
  name: string;
  description: string;
  status: string;
  dueDate: string;
  createdOn: string;
  completedOn?: string;
  createdBy: string;
  poc: string;
}

export interface TaskComment {
  id: number;
  comment: string;
  createdBy: string;
  createdOn: string;
}

export const taskService = {
  getTaskById: async (id: number) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch task');
    const data = await response.json();
    return data.task;
  },

  getAllTasks: async () => {
    const response = await fetch(`${API_URL}/tasks`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    const data = await response.json();
    return data.tasks;
  }
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await API.get(`/tasks/${id}`);
  return response.data.task;
};

export const updateTaskStatus = async (id: string, status: string): Promise<Task> => {
  const response = await API.put(`/tasks/${id}`, { status });
  return response.data.task;
};

export const getCommentsByTaskId = async (id: string): Promise<TaskComment[]> => {
  const response = await API.get(`/task-comments/${id}`);
  return response.data.taskComments;
};

export const addComment = async (taskId: string, comment: string): Promise<void> => {
  await API.post("/task-comments", { employeetaskid: Number(taskId), comment });
};