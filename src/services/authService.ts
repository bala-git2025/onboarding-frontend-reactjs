import API from "./api";

export interface LoginResponse {
  token: string;
  role: "Employee" | "Manager";
  userName: string;
  employeeId: number;
  employeeName?: string;
}

export const login = async (
  userName: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await API.post<LoginResponse>("/auth/login", { userName, password });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Invalid username or password";
    throw new Error(errorMessage);
  }
};