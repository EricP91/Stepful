import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Session,
  generateTimeSlots,
  selectSessions,
  getSelectedSessions,
  sortSlots,
} from "../../utils/slotsGenerate";
import {
  scheduleSessionsByCoach,
  getScheduledSessionsByCoach,
} from "../../apis";
import { SessionChart } from "../../components";
import { Slot } from "../../types/slots";
import "./coach-home.scss";

const CoachHome: React.FC = () => {
  const location = useLocation();
  const [weekSlots, setTimeSlots] = useState<Session[][]>([]);
  const [scheduledSlots, setScheduledSlots] = useState<string[]>([]);
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const { username } = location.state as { username: string };

  useEffect(() => {
    const fetchScheduledSessions = async () => {
      const result = await getScheduledSessionsByCoach(username);
      const slots = result.data.map((slot: Slot) => slot.start_time);
      updateSessions(slots);
    };
    fetchScheduledSessions();
  }, []);

  const handleSlotSelect = (dayIndex: number, slotIndex: number) => {
    const newSlots = selectSessions(weekSlots, dayIndex, slotIndex);
    setTimeSlots([...newSlots]);
  };

  const handleScheduleSessions = async () => {
    const selectedSlots: string[] = getSelectedSessions(weekSlots);
    const result = await scheduleSessionsByCoach(username, selectedSlots);
    const slots = [
      ...scheduledSlots,
      ...result.data.map((slot: Slot) => slot.start_time),
    ];
    updateSessions(slots);
  };

  const updateSessions = (slots: string[]) => {
    const sortedSlots = sortSlots(slots);

    setScheduledSlots(sortedSlots);
    const newSlots = generateTimeSlots(sortedSlots);
    setTimeSlots([...newSlots]);
  };

  return (
    <div className="home">
      <h1 className="home__title">Welcome {username}!</h1>
      <div className="home__content">
        <SessionChart slots={scheduledSlots} />
        <div className="home__schedule-container">
          <div className="home__schedule">
            {weekdays.map((day, dayIndex) => (
              <div key={dayIndex} className="home__day-column">
                <h2 className="home__day-title">{day}</h2>
                <div className="home__day-slots">
                  {weekSlots[dayIndex] &&
                    weekSlots[dayIndex].map((slot, slotIndex) => (
                      <button
                        key={slotIndex}
                        className={`home__slot-button ${
                          slot.isSelected && "home__slot-button-selected"
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
    </div>
  );
};

export default CoachHome;
