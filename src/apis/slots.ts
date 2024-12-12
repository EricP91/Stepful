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

export const getScheduledSessionsByCoach = async (coach_name: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/slots/${coach_name}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

export const getSlotDetail = async (user_id: string, slot: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/slot?coachId=${user_id}&startTime=${slot}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

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
};

export const getBookedSessionByStudent = async (student_name: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/slots/booked/${student_name}`
    );
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
    const response = await axios.post(`http://localhost:5000/calls/feedback`, {
      slot_id: slotId,
      score,
      notes,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};
