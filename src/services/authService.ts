import axios from "./axiosInstance";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const login = async (
  payload: LoginRequest
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    "/auth/login",
    payload
  );
  return response.data;
};
