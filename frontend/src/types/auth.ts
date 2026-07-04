export interface AuthUser {
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
}
