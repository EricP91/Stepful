import React, { useEffect, useState } from "react";
import {
  getBookedSessionByStudent,
  getScheduledSessionsByCoach,
  getUsersByRole,
  getSlotDetail,
  bookSession,
} from "../../apis";
import { SessionList, Modal, WeeklyCalendar } from "../../components";
import { ISlot, ISlotDetail } from "../../types/slots";
import "./student-home.scss";
import { generateHexColors } from "../../utils/colorGenerate";

interface IStudentHomeProps {
  userName: string;
}

interface ICoach {
  userId: number;
  userName: string;
}

const StudentHome: React.FC<IStudentHomeProps> = ({ userName }) => {
  const [coaches, setCoaches] = useState<ICoach[]>([]);
  const [currentSlots, setCurrentSlots] = useState<string[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<ICoach>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slotInfo, setSlotInfo] = useState<ISlotDetail>();
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [sessionList, setSessionList] = useState<ISlot[]>([]);
  const [studentScheduledSlots, setStudentScheduledSlots] = useState<ISlot[]>(
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
        (acc: { [index: string]: string }, coach: ICoach, index: number) => {
          acc[coach.userId] = randomGeneratedColors[index];
          return acc;
        },
        {}
      );
      setColorMaps(colorMap);
      const scheduledSlots = await getBookedSessionByStudent(userName);
      setStudentScheduledSlots(scheduledSlots.data);
    } catch (error) {
      console.error("Error fetching coaches:", error);
    }
  };

  const fetchSlots = async () => {
    try {
      const results = await getScheduledSessionsByCoach(
        selectedCoach?.userName ?? ""
      );
      setSessionList(results.data);
      const slots = results.data.map((slot: ISlot) => slot.startTime);
      setCurrentSlots(slots);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value, 10);
    const coach = coaches.find((c) => +c.userId === selectedId);
    setSelectedCoach(coach);
  };

  const handleSessionItemClick = (slot: string, index: number) => {
    setIsModalOpen(true);
    setCurrentSessionIndex(index);
    fetchSlotInfo(slot);
  };

  const fetchSlotInfo = async (slot: string) => {
    const result = await getSlotDetail(`${selectedCoach?.userId}`, slot);
    setSlotInfo(result);
  };

  const handleConfirmBook = async () => {
    const currentSession = sessionList[currentSessionIndex];
    await bookSession(currentSession.slotId, userName);
    fetchSlots();
    setIsModalOpen(false);
  };

  return (
    <div className="student-home">
      <h2 className="student-home__title">Welcome {userName}!</h2>
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
                <option key={coach.userId} value={coach.userId}>
                  {coach.userName}
                </option>
              ))}
            </select>
          </div>
          {currentSlots.length > 0 && (
            <SessionList
              slots={currentSlots}
              sessionList={sessionList}
              onSessionClick={handleSessionItemClick}
              highLightColor={colors[selectedCoach?.userId ?? 0]}
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
              sessionList[currentSessionIndex].bookedBy ? "" : "Schedule"
            }
            content={
              slotInfo ? (
                <div>
                  <h3>Session Details</h3>
                  <p>
                    <strong>Start Time:</strong> {slotInfo.startTime}
                  </p>
                  <p>
                    <strong>Booked By:</strong>{" "}
                    {slotInfo.bookedByName || "N/A"}
                  </p>
                  <p>
                    <strong>Coach:</strong> {slotInfo.userName}
                  </p>
                  {!!slotInfo.bookedByName && (
                    <div>
                      <p>
                        <strong>Coach Contact:</strong>{" "}
                        {slotInfo.coachPhoneNumber}
                      </p>
                      <p>
                        <strong>Student Contact:</strong>{" "}
                        {slotInfo.studentPhoneNumber || "N/A"}
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
