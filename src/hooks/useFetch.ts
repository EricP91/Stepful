import { useState, useEffect } from "react";

interface IFetchState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const useFetch = <T>(slotUrl: string): IFetchState<T> => {
  const [state, setState] = useState<IFetchState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    fetchSlotData();
  }, [slotUrl]);

  const fetchSlotData = async () => {
    try {
      const response = await fetch(slotUrl);
      const data = await response.json();
      setState({ data, error: null, loading: false });
    } catch (error: any) {
      setState({ data: null, error: error.message, loading: false });
    }
  };
  return state;
};
