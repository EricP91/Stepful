import axios from "axios";

export const scheduleSessionsByCoach = async (
  username: string,
  scheduledSlots: string[]
) => {
  try {
    const response = await axios.post("http://localhost:5000/slots", {
      user_name: username,
      slots: scheduledSlots,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

export const getScheduledSessionsByCoach = async (username: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/slots/${username}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}

export const getSlotDetail = async (username: string, slot: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/slot?coachName=${username}&startTime=${slot}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}

export const bookSession = async (slotId: number, username: string) => {
  try {
    const response = await axios.post(`http://localhost:5000/slots/book`, {
      user_name: username,
      slot_id: slotId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}