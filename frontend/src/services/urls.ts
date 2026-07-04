import { apiClient } from "../api/client";
import type { CreateUrlRequest, UrlResponse } from "../types/url";

export const urlService = {
  createUrl: async (request: CreateUrlRequest): Promise<UrlResponse> => {
    const response = await apiClient.post<UrlResponse>("/api/urls/create", request);
    return response.data;
  },

  getUserUrls: async (): Promise<UrlResponse[]> => {
    const response = await apiClient.get<UrlResponse[]>("/api/urls/my-urls");
    return response.data;
  },

  deleteUrl: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/urls/${id}`);
  },
};
