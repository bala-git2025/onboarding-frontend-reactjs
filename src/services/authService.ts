import API from "./api";

export interface LoginResponse {
  token: string;
  role: "Employee" | "Manager";
  userName: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await API.post<LoginResponse>("/login", { username, password });
  return response.data;
};
