
import api from "@/lib/api/axios";
import { ForgotPasswordRequest, LoginRequest, LoginResponse, RegisterRequest, ResetPasswordRequest, UserResponse } from "../types/auth.type";



export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/auth/login",
      data,
    );

    return response.data;
  },
  async register(data: RegisterRequest): Promise<UserResponse> {
    const response = await api.post<UserResponse>(
      "/auth/register",
      data,
    );

    return response.data;
  },
  
async forgotPassword(
  data: ForgotPasswordRequest,
): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(
    "/auth/forgot-password",
    data,
  );

  return response.data;
},
async resetPassword(
  data: ResetPasswordRequest,
): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(
    "/auth/reset-password",
    data,
  );

  return response.data;
},

 async getMe(): Promise<UserResponse> {
    const response = await api.get<UserResponse>("/auth/me");
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>("/auth/logout");
    return response.data;
  },

  async getGoogleAuthUrl(): Promise<{ url: string }> {
    const response = await api.get<{ url: string }>("/auth/google");
    return response.data;
  },

};

