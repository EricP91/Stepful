import { useState, useEffect } from "react";

interface FetchState<T> {
	data: T | null;
	error: string | null;
	loading: boolean;
}

export const useFetch = <T>(url: string): FetchState<T> => {
	const [state, setState] = useState<FetchState<T>>({
		data: null,
		error: null,
		loading: true,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(url);
				const data = await response.json();
				setState({ data, error: null, loading: false });
			} catch (error: any) {
				setState({ data: null, error: error.message, loading: false });
			}
		};

		fetchData();
	}, [url]);

	return state;
};