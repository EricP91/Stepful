import React, { useEffect, useState } from "react";
import { SessionList, Modal } from "../../components";
import {
  Session,
  generateTimeSlots,
  selectSessions,
  getSelectedSessions,
} from "../../utils/slotsGenerate";
import {
  scheduleSessionsByCoach,
  getScheduledSessionsByCoach,
  getSlotDetail,
} from "../../apis";
import { Slot, SlotDetail } from "../../types/slots";
import "./coach-home.scss";

interface CoachHomeProps {
  username: string;
}

const CoachHome: React.FC<CoachHomeProps> = ({ username }) => {
  const [weekSlots, setTimeSlots] = useState<Session[][]>([]);
  const [scheduledSlots, setScheduledSlots] = useState<string[]>([]);
  const [sessionList, setSessionList] = useState<Slot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slotInfo, setSlotInfo] = useState<SlotDetail>();
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  
  useEffect(() => {
    fetchScheduledSessions();
  }, []);

  const fetchScheduledSessions = async () => {
    const result = await getScheduledSessionsByCoach(username);
    setSessionList(result.data);
    const slots = result.data.map((slot: Slot) => slot.start_time);
    updateSessions(slots);
  };

  const handleSlotSelect = (dayIndex: number, slotIndex: number) => {
    const newSlots = selectSessions(weekSlots, dayIndex, slotIndex);
    setTimeSlots([...newSlots]);
  };

  const handleScheduleSessions = async () => {
    const selectedSlots: string[] = getSelectedSessions(weekSlots);
     await scheduleSessionsByCoach(username, selectedSlots);
    fetchScheduledSessions();
  };

  const updateSessions = (slots: string[]) => {
    setScheduledSlots(slots);
    const newSlots = generateTimeSlots(slots);
    setTimeSlots([...newSlots]);
  };

  const handleSessionItemClick = (slot: string, _: number) => {
    setIsModalOpen(true);
    fetchSlotDetail(slot);
  };

  const fetchSlotDetail = async (slot: string) => {
    const username = sessionStorage.getItem("username");
    const result = await getSlotDetail(username ?? "", slot);
    setSlotInfo(result);
  };

  return (
    <div className="coach-home">
      <h1 className="coach-home__title">Welcome {username}!</h1>
      <div className="coach-home__content">
        <SessionList slots={scheduledSlots} onSessionClick={handleSessionItemClick} sessionList={sessionList}/>
        <div className="coach-home__schedule-container">
          <div className="coach-home__schedule">
            {weekdays.map((day, dayIndex) => (
              <div key={dayIndex} className="coach-home__day-column">
                <h2 className="coach-home__day-title">{day}</h2>
                <div className="coach-home__day-slots">
                  {weekSlots[dayIndex] &&
                    weekSlots[dayIndex].map((slot, slotIndex) => (
                      <button
                        key={slotIndex}
                        className={`coach-home__slot-button ${
                          slot.isSelected && "coach-home__slot-button-selected"
                        }`}
                        onClick={() => handleSlotSelect(dayIndex, slotIndex)}
                      >
                        {slot.start.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {slot.end.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <button className="schedule__button" onClick={handleScheduleSessions}>
            Schedule Sessions
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
              <p>
                <strong>Satisfaction Score:</strong>{" "}
                {slotInfo.satisfaction_score || "N/A"}
              </p>
              <p>
                <strong>Notes:</strong> {slotInfo.notes || "No notes available"}
              </p>
            </div>
          ) : (
            <div>Loading...</div>
          )
        }
      />
    </div>
  );
};

export default CoachHome;
