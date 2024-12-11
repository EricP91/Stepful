import React, { useEffect, useState } from "react";
import {
  getScheduledSessionsByCoach,
  getUsersByRole,
  getSlotDetail,
  bookSession,
} from "../../apis";
import { SessionList, Modal } from "../../components";
import { Slot, SlotDetail } from "../../types/slots";
import "./student-home.scss";

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

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const coachList = await getUsersByRole("coach");
        setCoaches(coachList);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };
    fetchCoaches();
  }, []);

  useEffect(() => {
    if (selectedCoach) fetchSlots();
  }, [selectedCoach]);

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
    const result = await getSlotDetail(selectedCoach?.user_name ?? "", slot);
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
      <div className="student-home__select-container">
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
        />
      )}
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
                  <strong>Booked By:</strong> {slotInfo.booked_by_name || "N/A"}
                </p>
                <p>
                  <strong>Coach:</strong> {slotInfo.user_name}
                </p>
              </div>
            ) : (
              <div>Loading...</div>
            )
          }
        />
      )}
    </div>
  );
};
export default StudentHome;
