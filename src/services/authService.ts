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
  } catch (error: any) {
    if (error.response) {
      // Backend responded with an error status
      const errorMessage = error.response.data?.message || "Invalid username or password";
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response (backend down)
      throw new Error("Unable to connect to server. Please try again later.");
    } else {
      // Something else happened
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};