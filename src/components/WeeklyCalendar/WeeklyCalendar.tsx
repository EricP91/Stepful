import React, { useState } from "react";
import { ISlot, ISlotDetail } from "../../types/slots";
import { getSlotDetail, leaveFeedback } from "../../apis";
import Modal from "../Modal/Modal";
import StarScore from "../StarScore/StarScore";
import "./weekly-calendar.scss";

interface IWeeklyCalendarProps {
  bookedSlots: ISlot[];
  colors: { [index: number]: string };
}

const WeeklyCalendar: React.FC<IWeeklyCalendarProps> = ({
  bookedSlots,
  colors,
}) => {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const weekdayTitle = ["", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const [slotInfo, setSlotInfo] = useState<ISlotDetail>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState("");

  const timeRange = Array.from({ length: 16 }, (_, i) => {
    const hour = Math.floor(9 + i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const period = hour < 12 ? "AM" : "PM";
    const hour12 = hour > 12 ? hour - 12 : hour;
    return `${hour12.toString().padStart(2, "0")}:${minute} ${period}`;
  });

  const handleSessionClick = async (slot: ISlot) => {
    const result = await getSlotDetail(`${slot.coachId}`, slot?.startTime);
    setSlotInfo(result);
    setNotes(result?.notes);
    setIsModalOpen(true);
  };

  const handleReviewConfirm = async () => {
    await leaveFeedback(`${slotInfo?.slotId ?? ""}`, score, notes);
    setIsModalOpen(false);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  const isPast = (slot: string) => {
    const currentDate = new Date();
    if (currentDate.getDay() - 1 > weekdays.indexOf(slot.slice(0, 3)))
      return true;
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;

    const formattedMinutes = minutes > 0 ? `30` : "00";
    const currentTimeLabel = `${hour12.toString().padStart(2, "0")}:${formattedMinutes} ${period}`;

    return timeRange.indexOf(currentTimeLabel) < timeRange.indexOf(slot);
  };

  const currentLineX = () => {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;

    const formattedMinutes = minutes > 0 ? `30` : "00";
    const currentTimeLabel = `${hour12.toString().padStart(2, "0")}:${formattedMinutes} ${period}`;
    const currentTimeIndex = timeRange.indexOf(currentTimeLabel);

    return currentTimeIndex * 40 + (minutes % 30) * (40 / 30);
  };

  return (
    <div className="weekly-calendar">
      <div className="weekly-calendar__header">
        {weekdayTitle.map((weekday, weekIndex) => (
          <div className="weekly-calendar__day" key={`weekday-${weekIndex}`}>
            {weekday}
          </div>
        ))}
      </div>
      <div className="weekly-calendar__body">
        <div className="weekly-calendar__column">
          {timeRange.map((_, timeIndex) => (
            <div
              key={`timeIndex-${timeIndex}`}
              className="weekly-calendar__slot"
            >
              {timeRange[timeIndex]}
            </div>
          ))}
        </div>
        {weekdays.map((_, weekIndex) => (
          <div
            className="weekly-calendar__column"
            key={`slot-weekday-${weekIndex}`}
          >
            {timeRange.map((_, timeIndex) => {
              return (
                <div
                  key={`slot-time-${timeIndex}`}
                  className="weekly-calendar__slot"
                ></div>
              );
            })}
          </div>
        ))}
        {bookedSlots.map((slot) => {
          const weekday = slot.startTime.slice(0, 3);
          const slotTime = slot.startTime.slice(4);
          const weekIndex = weekdays.indexOf(weekday) + 1;
          const timeIndex = timeRange.indexOf(slotTime);
          const bgColor = colors[slot?.coachId ?? 0];
          const slotStyle: React.CSSProperties = {
            backgroundColor: bgColor,
            top: `${timeIndex * 40}px`,
            left: `${weekIndex * 120 + (weekIndex - 1) + 1}px`,
          };
          if (isPast(slot.startTime)) {
            slotStyle.background = `repeating-linear-gradient(45deg,  ${bgColor}, ${bgColor} 2px, ${bgColor}50 2px, ${bgColor}50 5px)`;
          }

          return (
            <div
              key={slot.slotId}
              className="weekly-calendar__booked"
              style={slotStyle}
              onClick={() => handleSessionClick(slot)}
            ></div>
          );
        })}
        <div
          className="weekly-calendar__current-line"
          style={{ top: currentLineX() }}
        ></div>
      </div>
      {slotInfo && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleReviewConfirm}
          confirmText={!!slotInfo.score || !!slotInfo.notes ? "" : "Confirm"}
          content={
            slotInfo ? (
              <div className="review__modal">
                <h3>Session Review</h3>
                <p>
                  <strong>Start Time:</strong> {slotInfo.startTime}
                </p>
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "10px" }}
                >
                  <p>
                    <strong>Booked By:</strong>{" "}
                    {slotInfo.bookedByName || "N/A"}
                  </p>
                  <p>
                    <strong>Coach:</strong> {slotInfo.userName}
                  </p>
                </div>
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
                <StarScore
                  initialScore={+slotInfo.score}
                  disabled={!!slotInfo.score}
                  onScoreChange={setScore}
                />
                <textarea
                  placeholder="Enter your notes"
                  value={notes || ""}
                  onChange={handleNotesChange}
                  disabled={!!slotInfo.notes}
                />
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

export default WeeklyCalendar;
