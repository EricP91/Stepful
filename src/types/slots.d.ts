export interface ISlot {
  id: number;
  coach_id: number;
  start_time: string;
  booked_by?: number;
  course_info?: string;
}

interface ISlotDetail {
  id: number;
  notes: string;
  score: string;
  start_time: string;
  booked_by_name: string;
  user_name: string;
  coach_phone_number: string;
  student_phone_number: string;
}
