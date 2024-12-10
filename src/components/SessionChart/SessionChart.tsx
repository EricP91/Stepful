import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { getSlotInfo } from "../../apis";
import "./sessionChart.scss";

interface SessionChartProps {
  slots: string[];
}

interface SlotInfo {
  notes: string;
  satisfaction_score: string;
  start_time: string;
  booked_by_name: string;
  user_name: string;
}

const SessionChart: React.FC<SessionChartProps> = ({ slots }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slotInfo, setSlotInfo] = useState<SlotInfo>();

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

  const handleItemClick = (slot: string) => {
    setIsModalOpen(true);
    fetchSlotInfo(slot);
  };

  const fetchSlotInfo = async (slot: string) => {
    const username = sessionStorage.getItem("username");
    const result = await getSlotInfo(username ?? "", slot);
    setSlotInfo(result);
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
              className="session-chart__item"
              onClick={() => handleItemClick(slot)}
            >
              <span className="session-chart__weekday">{weekday}</span>
              <span className="session-chart__time">
                {startTime + " " + stands} - {endTime}
              </span>
            </li>
          );
        })}
      </ul>

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

export default SessionChart;
