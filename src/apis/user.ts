import axios from "axios";

export interface LoginResponse {
  token: string;
  message: string;
	role_name: string;
}

export const login = async (username: string, password: string) => {
	try {
		const response = await axios.post<LoginResponse>(
			"http://localhost:5000/auth/login",
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
		const response = await axios.get(`http://localhost:5000/users/${role_name}`);
		return response.data.users;
	} catch (error: any) {
		throw new Error(error.response.data);
	}
}