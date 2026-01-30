import API from "./api";

export interface LoginResponse {
  token: string;
  role: "Employee" | "Manager";
  userName: string;
  employeeId: number;
  employeeName?: string;
}

export interface ProfileResponse {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  role: "Employee" | "Manager";
  teamName?: string;
  joiningDate?: string;
  primarySkill?: string;
  lastUpdated?: string;
}


export const login = async (
  userName: string,
  password: string,
): Promise<LoginResponse> => {
  const response = await API.post<LoginResponse>("/auth/login", {
    userName,
    password,
  });
  return response.data;
};

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await API.get<ProfileResponse>("/auth/profile");
  return response.data;
};

/* ------------------ NEW UPDATE PROFILE METHOD ------------------ */
export const updateProfile = async (
  updates: Partial<Pick<ProfileResponse, "email" | "phone" | "primarySkill">>,
): Promise<ProfileResponse> => {
  const response = await API.put<ProfileResponse>("/auth/profile", updates);
  return response.data;
};
