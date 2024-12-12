import axios from "axios";
import { ILoginResponse } from "../types/slots";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (userName: string, password: string) => {
  try {
    const response = await axios.post<ILoginResponse>(`${API_URL}/auth/login`, {
      userName,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

export const getUsersByRole = async (roleName: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/${roleName}`);
    return response.data.users;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

export const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userId");
}