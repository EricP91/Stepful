import React from "react";
import { Slot } from "../../types/slots";
import './session-list.scss';

interface SessionListProps {
  slots: string[];
  sessionList: Slot[];
  onSessionClick: (slot: string, index: number) => void;
}

const SessionList: React.FC<SessionListProps> = ({ slots, onSessionClick, sessionList }) => {
  const calculateEndTime = (startTime: string): string => {
    const timeRegex = /(\d{1,2}):(\d{2}) (\w{2})/;
    const match = startTime.match(timeRegex);
    if (!match) {
      throw new Error("Invalid time format");
    }
    let [_, hour, minutes, period] = match;
    let hh = parseInt(hour, 10);
    let mm = parseInt(minutes, 10);

    hh += 2;
    if (hh >= 12) {
      period = period === "AM" ? "PM" : "AM";
    }
    if (hh > 12) {
      hh -= 12;
    }
    return `${hh}:${mm.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="session-chart">
      <h2 className="session-chart__title">Scheduled Sessions</h2>
      <ul className="session-chart__list">
        {slots.map((slot, index) => {
          const [weekday, startTime, stands] = slot.split(" ");
          const endTime = calculateEndTime(startTime + " " + stands);
          return (
            <li
              key={index}
              className={`${sessionList[index].booked_by ? "session-chart__item--booked" : "session-chart__item"}`}
              onClick={() => onSessionClick(slot, index)}
            >
              <span className="session-chart__weekday">{weekday}</span>
              <span className="session-chart__time">
                {startTime + " " + stands} - {endTime}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SessionList;
