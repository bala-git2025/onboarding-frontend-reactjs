import API from "./api";

/* ------------------ TYPES ------------------ */
export interface TaskOption {
  id: number;
  name: string;
}

export interface CreateTaskPayload {
  taskId: number;
  employeeId: number;
  dueDate: string;
  status: string;
  description: string;
  poc: string;
  priority: string;
  createdBy: string;
  updatedBy: string;
}

/* Employee type with all fields from backend */
export interface Employee {
  id: number;
  teamId: number;
  name: string;
  email: string;
  phone: string;
  joiningDate: string;
  primarySkill: string;
  createdBy: string;
  updatedBy: string | null;
  createdOn: string;
  updatedOn: string;
}

/* ------------------ FETCH AVAILABLE TASKS ------------------ */
export const getAvailableTasks = async (): Promise<TaskOption[]> => {
  try {
    const res = await API.get("/tasks");

    if (Array.isArray(res.data)) {
      return res.data as TaskOption[];
    }
    if (Array.isArray(res.data.tasks)) {
      return res.data.tasks as TaskOption[];
    }

    console.warn("Unexpected /tasks response shape:", res.data);
    return [];
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return [];
  }
};

/* ------------------ CREATE TASK ------------------ */
export const createTask = async (payload: CreateTaskPayload): Promise<void> => {
  try {
    await API.post("/manager/addTask", payload);
  } catch (err) {
    console.error("Error creating task:", err);
    throw err;
  }
};

/* ------------------ GET EMPLOYEE BY ID ------------------ */
export const getEmployeeById = async (id: number): Promise<Employee> => {
  try {
    const res = await API.get(`/employees/${id}`);
    // Backend wraps employee object under "employee"
    return res.data.employee as Employee;
  } catch (err) {
    console.error("Error fetching employee:", err);
    throw err;
  }
};