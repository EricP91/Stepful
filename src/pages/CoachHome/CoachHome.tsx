import React, { useEffect, useState } from "react";
import { SessionList, Modal } from "../../components";
import {
  generateTimeSlots,
  selectSessions,
  getSelectedSessions,
} from "../../utils/slotsGenerate";
import {
  scheduleSessionsByCoach,
  getScheduledSessionsByCoach,
  getSlotDetail,
} from "../../apis";
import { ISlot, ISlotDetail, ISession } from "../../types/slots";
import "./coach-home.scss";

interface ICoachHomeProps {
  username: string;
}

const CoachHome: React.FC<ICoachHomeProps> = ({ username }) => {
  const [weekSlots, setTimeSlots] = useState<ISession[][]>([]);
  const [scheduledSlots, setScheduledSlots] = useState<string[]>([]);
  const [sessionList, setSessionList] = useState<ISlot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slotInfo, setSlotInfo] = useState<ISlotDetail>();
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  useEffect(() => {
    fetchScheduledSessions();
  }, []);

  const fetchScheduledSessions = async () => {
    const result = await getScheduledSessionsByCoach(username);
    setSessionList(result.data);
    const slots = result.data.map((slot: ISlot) => slot.start_time);
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

  const handleRemoveSelection = () => {
    const removeSelection = weekSlots.map((day) => {
      return day.map((slot) => {
        slot.isSelected = false;
        return slot;
      });
    });
    setTimeSlots(removeSelection);
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
    const userId = sessionStorage.getItem("userId");
    const result = await getSlotDetail(userId ?? "", slot);
    setSlotInfo(result);
  };

  return (
    <div className="coach-home">
      <h1 className="coach-home__title">Welcome {username}!</h1>
      <div className="coach-home__content">
        <SessionList
          slots={scheduledSlots}
          onSessionClick={handleSessionItemClick}
          sessionList={sessionList}
        />
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
          <div className="action__container">
            <button
              className="schedule__button"
              onClick={handleScheduleSessions}
            >
              Schedule Sessions
            </button>
            <button className="cancel__button" onClick={handleRemoveSelection}>
              Cancel
            </button>
          </div>
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
              <p>
                <strong>Score:</strong> {slotInfo.score || "N/A"}
              </p>
              <p>
                <strong>Notes:</strong>
                {slotInfo.notes || "No notes available"}
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
