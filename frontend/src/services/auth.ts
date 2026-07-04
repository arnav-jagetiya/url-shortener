import { apiClient } from "../api/client";
import type { AuthResponse } from "../types/auth";

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/api/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },
};
