import API from "./api";

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  joiningDate: string;
  primarySkill: string;
}

export interface EmployeeTask {
  id: number;
  taskName: string;
  dueDate: string;
  status: string;
}

export interface TaskDetail {
  id: number;
  name: string;
  status: string;
  dueDate: string;
  createdOn: string;
  description: string;
  pointOfContact: string;
  comments: TaskComment[];
}

export interface TaskComment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export const getEmployeeDetails = async (): Promise<Employee> => {
  try {
    const res = await API.get("/employee/me");
    console.log("Employee details response:", res.data);
    return res.data.employee;
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Error fetching employee details:", err);
    console.error("Error response:", err.response?.data);
    throw err;
  }
};

export const getEmployeeTasks = async (): Promise<EmployeeTask[]> => {
  try {
    const res = await API.get("/employee/me/tasks");
    console.log("Employee tasks response:", res.data);
    return res.data.tasks;
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Error fetching employee tasks:", err);
    console.error("Error response:", err.response?.data);
    throw err;
  }
};

export const getTaskDetail = async (taskId: number): Promise<TaskDetail> => {
  const employeeId = localStorage.getItem("employeeId") || sessionStorage.getItem("employeeId");
  const res = await API.get(`/employees/${employeeId}/tasks/${taskId}`);
  return res.data.task;
};

export const updateTaskStatus = async (taskId: number, status: string): Promise<void> => {
  const employeeId = localStorage.getItem("employeeId") || sessionStorage.getItem("employeeId");
  await API.put(`/employees/${employeeId}/tasks/${taskId}`, { status });
};

export const addTaskComment = async (taskId: number, comment: string): Promise<TaskComment> => {
  const employeeId = localStorage.getItem("employeeId") || sessionStorage.getItem("employeeId");
  const res = await API.post(`/employees/${employeeId}/tasks/${taskId}/comments`, { comment });
  return res.data.comment;
};