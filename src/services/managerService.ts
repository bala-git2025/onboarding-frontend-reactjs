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

export interface TeamMember {
  teamId: number;
  teamName: string;
  status: string;
  employeeId: number;
  dueDate: string | Date;
}

export interface TeamSummary {
  teamId: number;
  teamName: string;
  dueDate: Date | null;
  members: number;
  completed: number;
  pending: number;
  Overdue: number;
}


export interface EmployeeTaskSummary {
  employeeId: number;
  employeeName: string;
  totalTasks: number;
  completedTask: number;
  pendingTask: number;
  overDueTask: number;
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

/* ============= MANAGER TEAM SUMMARY (Dashboard API) ============= */

export const getManagerTeamsSummary = async (): Promise<TeamSummary[]> => {
  try {
    const res = await API.get("/manager/id");   // <-- same endpoint your component used

    const list: TeamMember[] = res.data.teamList || [];

    const groups: Record<number, any> = {};

    list.forEach((item) => {
      const due = new Date(item.dueDate);

      if (!groups[item.teamId]) {
        groups[item.teamId] = {
          teamId: item.teamId,
          teamName: item.teamName,
          dueDate: due,
          members: 0,
          completed: 0,
          pending: 0,
          Overdue: 0,
          memberSet: new Set(),
        };
      }

      groups[item.teamId].memberSet.add(item.employeeId);

      const status = item.status.toLowerCase();
      const isPastDue = !isNaN(due.getTime()) && due < new Date();

      if (status === "completed") {
        groups[item.teamId].completed++;
      } else if (isPastDue) {
        groups[item.teamId].Overdue++;
      } else {
        groups[item.teamId].pending++;
      }
    });

    return Object.values(groups).map((g: any) => ({
      ...g,
      members: g.memberSet.size,
    }));
  } catch (err) {
    console.error("Error fetching team summary:", err);
    throw err;
  }
};

/* ============= GET TEAM MEMBERS SUMMARY (Team Dashboard) ============= */


export const getTeamMembersSummary = async (teamId: string | number): Promise<EmployeeTaskSummary[]> => {
  try {
    const res = await API.get(`/manager/team/${teamId}`);

    const teamList: any[] = res.data.teamList || [];
    const grouped: Record<number, EmployeeTaskSummary> = {};

    teamList.forEach((item) => {
      if (!grouped[item.employeeId]) {
        grouped[item.employeeId] = {
          employeeId: item.employeeId,
          employeeName: item.name,
          totalTasks: 0,
          completedTask: 0,
          pendingTask: 0,
          overDueTask: 0,
        };
      }

      grouped[item.employeeId].totalTasks += 1;

      if (item.status === "Completed") {
        grouped[item.employeeId].completedTask += 1;
      } else if (item.status === "Pending") {
        grouped[item.employeeId].pendingTask += 1;
      } else if (item.status === "Overdue") {
        grouped[item.employeeId].overDueTask += 1;
      }
    });

    return Object.values(grouped);
  } catch (err) {
    console.error("Error fetching team summary:", err);
    throw err;
  }
};