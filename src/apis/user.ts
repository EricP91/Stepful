import axios from "axios";

export interface LoginResponse {
  token: string;
  message: string;
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