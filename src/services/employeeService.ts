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

interface BackendComment {
  id: number;
  comment: string;
  createdOn: string;
}

export const getEmployeeDetails = async (employeeId: number): Promise<Employee> => {
  const res = await API.get(`/employees/${employeeId}`);
  return res.data.employee;
};

export const getEmployeeTasks = async (employeeId: number): Promise<EmployeeTask[]> => {
  const res = await API.get(`/employees/${employeeId}/tasks`);
  return res.data.tasks;
};

export const getTaskDetail = async (employeeId: number, taskId: number): Promise<TaskDetail> => {
  const res = await API.get(`/employees/${employeeId}/tasks/${taskId}`);
  const rawTask = res.data.task;
  
  const commentsRes = await API.get<{ taskComments: BackendComment[] }>(`/taskComments/${taskId}`);
  
  return {
      ...rawTask,
      pointOfContact: rawTask.POC || "N/A",
      comments: commentsRes.data.taskComments.map((c: BackendComment) => ({
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addTaskComment = async (employeeId: number, taskId: number, comment: string, displayName?: string): Promise<TaskComment> => {
  await API.post(`/employees/${employeeId}/tasks/${taskId}/comments`, { comment });
  
  return {
    id: Date.now(),
    text: comment,
    author: "You",
    timestamp: new Date().toISOString()
  };
};

export const deleteEmployeeTask = async (employeeId: number, taskId: number): Promise<void> => {
 await API.delete(`/employees/${employeeId}/tasks/${taskId}`);
}