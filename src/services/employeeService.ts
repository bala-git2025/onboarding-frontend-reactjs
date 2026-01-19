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


export const getEmployeeDetails = async (): Promise<Employee> => {
const res = await API.get("/employee/me");
return res.data.employee;
};


export const getEmployeeTasks = async (): Promise<EmployeeTask[]> => {
const res = await API.get("/employee/me/tasks");
return res.data.tasks;
};