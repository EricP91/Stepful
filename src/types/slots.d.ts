export interface Slot {
  id: number;
  coach_id: number;
  start_time: string;
  booked_by?: number;
  course_info?: string;
}

interface SlotDetail {
  notes: string;
  satisfaction_score: string;
  start_time: string;
  booked_by_name: string;
  user_name: string;
}
