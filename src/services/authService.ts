import API from "./api";

export interface LoginResponse {
  token: string;
  role: "Employee" | "Manager";
  userName: string;
}

export const login = async (
  userName: string,
  password: string
): Promise<LoginResponse> => {
  const response = await API.post<LoginResponse>("/auth/login", { userName, password });
  return response.data;
};