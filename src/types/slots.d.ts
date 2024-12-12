export interface ISlot {
  slotId: number;
  coachId: number;
  startTime: string;
  bookedBy?: number;
  courseInfo?: string;
}

interface ISlotDetail {
  slotId: number;
  notes: string;
  score: string;
  startTime: string;
  bookedByName: string;
  userName: string;
  coachPhoneNumber: string;
  studentPhoneNumber: string;
}

export interface ISession {
  start: Date;
  end: Date;
  isSelected: boolean;
}

export interface ILoginResponse {
  token: string;
  message: string;
  userId: number;
  roleName: string;
}