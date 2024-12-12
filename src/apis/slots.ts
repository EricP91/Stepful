import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const scheduleSessionsByCoach = async (
  userName: string,
  scheduledSlots: string[]
) => {
  try {
    const response = await axios.post(`${API_URL}/slots`, {
      userName,
      slots: scheduledSlots,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

export const getScheduledSessionsByCoach = async (coachName: string) => {
  try {
    const response = await axios.get(`${API_URL}/slots/${coachName}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

export const getSlotDetail = async (userId: string, slot: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/slot?coachId=${userId}&startTime=${slot}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

export const bookSession = async (slotId: number, userName: string) => {
  try {
    console.log(slotId, userName);
    const response = await axios.post(`${API_URL}/slots/book`, {
      userName,
      slotId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

export const getBookedSessionByStudent = async (studentName: string) => {
  try {
    const response = await axios.get(`${API_URL}/slots/booked/${studentName}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

export const leaveFeedback = async (
  slotId: string,
  score: number,
  notes: string
) => {
  try {
    const response = await axios.post(`${API_URL}/calls/feedback`, {
      slotId,
      score,
      notes,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};
