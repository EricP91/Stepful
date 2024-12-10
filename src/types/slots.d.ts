export interface Slot {
  id: number;
  coach_id: number;
  start_time: string;
  booked_id?: number;
  course_info?: string;
}