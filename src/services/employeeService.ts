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
  name: string;
  description: string;
  dueDate: string;
  status: string;
  createdOn: string;
  POC: string;
  employeeTaskId: number;
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

export const getEmployeeDetails = async (employeeId: number): Promise<Employee> => {
  try {
    const res = await API.get(`/employees/${employeeId}`);
    console.log("Employee details response:", res.data);
    return res.data.employee;
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Error fetching employee details:", err);
    throw err;
  }
};

export const getEmployeeTasks = async (employeeId: number): Promise<EmployeeTask[]> => {
  try {
    const res = await API.get(`/employees/${employeeId}/tasks`);
    console.log("Employee tasks response:", res.data);
    return res.data.tasks;
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Error fetching employee tasks:", err);
    throw err;
  }
};

export const getTaskDetail = async (employeeId: number, taskId: number): Promise<TaskDetail> => {
  const res = await API.get(`/employees/${employeeId}/tasks/${taskId}`);
  const task = res.data.task;
  const commentsRes = await API.get(`/task-comments/${taskId}`);

  return {
    ...task,
    pointOfContact: task.POC || "N/A",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    comments: commentsRes.data.taskComments.map((c: any) => ({
      id: c.id,
      text: c.comment,
      author: "User",
      timestamp: c.createdOn
    }))
  };
};

export const updateTaskStatus = async (employeeId: number, taskId: number, status: string): Promise<void> => {
  await API.put(`/employees/${employeeId}/tasks/${taskId}`, { status });
};

export const addTaskComment = async (employeeId: number, taskId: number, comment: string): Promise<TaskComment> => {
  const res = await API.post(`/employees/${employeeId}/tasks/${taskId}/comments`, { comment });
  return res.data.comment;
};