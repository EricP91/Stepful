import React, { useEffect, useState } from "react";
import {
  getBookedSessionByStudent,
  getScheduledSessionsByCoach,
  getUsersByRole,
  getSlotDetail,
  bookSession,
} from "../../apis";
import { SessionList, Modal, WeeklyCalendar } from "../../components";
import { Slot, SlotDetail } from "../../types/slots";
import "./student-home.scss";
import { generateHexColors } from "../../utils/colorGenerate";

interface StudentHomeProps {
  username: string;
}

interface Coach {
  user_id: number;
  user_name: string;
}

const StudentHome: React.FC<StudentHomeProps> = ({ username }) => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [currentSlots, setCurrentSlots] = useState<string[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slotInfo, setSlotInfo] = useState<SlotDetail>();
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [sessionList, setSessionList] = useState<Slot[]>([]);
  const [studentScheduledSlots, setStudentScheduledSlots] = useState<Slot[]>(
    []
  );
  const [colors, setColorMaps] = useState<{ [index: number]: string }>({});

  useEffect(() => {
    initialFetch();
  }, []);

  useEffect(() => {
    if (selectedCoach) fetchSlots();
  }, [selectedCoach]);

  const initialFetch = async () => {
    try {
      const coachList = await getUsersByRole("coach");
      setCoaches(coachList);
      const randomGeneratedColors = generateHexColors(coachList.length);
      const colorMap = coachList.reduce(
        (acc: { [index: string]: string }, coach: Coach, index: number) => {
          acc[coach.user_id] = randomGeneratedColors[index];
          return acc;
        },
        {}
      );
      setColorMaps(colorMap);
      const scheduledSlots = await getBookedSessionByStudent(username);
      setStudentScheduledSlots(scheduledSlots.data);
    } catch (error) {
      console.error("Error fetching coaches:", error);
    }
  };

  const fetchSlots = async () => {
    try {
      const results = await getScheduledSessionsByCoach(
        selectedCoach?.user_name ?? ""
      );
      setSessionList(results.data);
      const slots = results.data.map((slot: Slot) => slot.start_time);
      setCurrentSlots(slots);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value, 10);
    const coach = coaches.find((c) => +c.user_id === selectedId);
    setSelectedCoach(coach);
  };

  const handleSessionItemClick = (slot: string, index: number) => {
    setIsModalOpen(true);
    setCurrentSessionIndex(index);
    fetchSlotInfo(slot);
  };

  const fetchSlotInfo = async (slot: string) => {
    const result = await getSlotDetail(`${selectedCoach?.user_id}`, slot);
    setSlotInfo(result);
  };

  const handleConfirmBook = async () => {
    const currentSession = sessionList[currentSessionIndex];
    await bookSession(currentSession.id, username);
    fetchSlots();
    setIsModalOpen(false);
  };

  return (
    <div className="student-home">
      <h2 className="student-home__title">Welcome {username}!</h2>
      <div className="student-home__content">
        <div className="student-home__select-container">
          <div className="student-home__select-input">
            <label htmlFor="coach-select" className="student-home__label">
              Select a coach:
            </label>
            <select
              id="coach-select"
              className="student-home__select"
              onChange={handleSelectChange}
              defaultValue=""
            >
              <option value="" disabled>
                Choose a coach
              </option>
              {coaches.map((coach) => (
                <option key={coach.user_id} value={coach.user_id}>
                  {coach.user_name}
                </option>
              ))}
            </select>
          </div>
          {currentSlots.length > 0 && (
            <SessionList
              slots={currentSlots}
              sessionList={sessionList}
              onSessionClick={handleSessionItemClick}
              highLightColor={colors[selectedCoach?.user_id ?? 0]}
            />
          )}
        </div>
        <div className="student-home__calendar--container">
          <WeeklyCalendar bookedSlots={studentScheduledSlots} colors={colors} />
        </div>
        {sessionList.length > 0 && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmBook}
            confirmText={
              sessionList[currentSessionIndex].booked_by ? "" : "Schedule"
            }
            content={
              slotInfo ? (
                <div>
                  <h3>Session Details</h3>
                  <p>
                    <strong>Start Time:</strong> {slotInfo.start_time}
                  </p>
                  <p>
                    <strong>Booked By:</strong>{" "}
                    {slotInfo.booked_by_name || "N/A"}
                  </p>
                  <p>
                    <strong>Coach:</strong> {slotInfo.user_name}
                  </p>
                  {!!slotInfo.booked_by_name && (
                    <div>
                      <p>
                        <strong>Coach Contact:</strong>{" "}
                        {slotInfo.coach_phone_number}
                      </p>
                      <p>
                        <strong>Student Contact:</strong>{" "}
                        {slotInfo.student_phone_number || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>Loading...</div>
              )
            }
          />
        )}
      </div>
    </div>
  );
};
export default StudentHome;
