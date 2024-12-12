import axios from "axios";

export interface LoginResponse {
  token: string;
  message: string;
  user_id: number;
  role_name: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/auth/login`,
      {
        username,
        password,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

export const getUsersByRole = async (role_name: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/${role_name}`
    );
    return response.data.users;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};
