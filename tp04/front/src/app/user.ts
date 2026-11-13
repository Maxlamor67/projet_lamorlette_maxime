export interface User {
  id?: number;
  username: string;
  password?: string;
  passwordConfirmation?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
