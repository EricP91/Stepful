export interface Session {
  start: Date;
  end: Date;
  isSelected: boolean;
}

const getMinutesDifference = (date1: Date, date2: Date) => {
  return Math.abs((date2.getTime() - date1.getTime()) / (1000 * 60));
};

export const generateTimeSlots = (scheduledSlots: string[]): Session[][] => {
  const weekSlots: Session[][] = [];
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  weekdays.forEach((day) => {
    let daySlot: Session[] = [];
    const start = new Date();
    start.setHours(9, 0, 0, 0);

    const end = new Date();
    end.setHours(17, 0, 0, 0);

    while (start < end) {
      const next = new Date(start);
      next.setMinutes(next.getMinutes() + 30);

      const slotLabel = `${day} ${start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      if (!scheduledSlots.includes(slotLabel)) {
        daySlot.push({
          start: new Date(start),
          end: new Date(next),
          isSelected: false,
        });
      } else {
        start.setMinutes(start.getMinutes() + 30 * 3);
      }
      start.setMinutes(start.getMinutes() + 30);
    }
    weekSlots.push(daySlot);
  });
  return weekSlots;
};

export const removeSchedule = (
  weekSlots: Session[][],
  dayIndex: number,
  slotIndex: number
) => {
  let startIndex = slotIndex;
  if (weekSlots[dayIndex][slotIndex - 1].isSelected) {
    for (let i = Math.max(0, slotIndex - 3); i <= slotIndex; i++) {
      if (weekSlots[dayIndex][i].isSelected) {
        startIndex = i;
        break;
      }
    }
  }
  for (let i = startIndex; i < startIndex + 4; i++) {
    weekSlots[dayIndex][i].isSelected = false;
  }
  return weekSlots;
};

export const selectSessions = (
  weekSlots: Session[][],
  dayIndex: number,
  slotIndex: number
) => {
  if (
    slotIndex + 4 > weekSlots[dayIndex].length ||
    getMinutesDifference(
      weekSlots[dayIndex][slotIndex].start,
      weekSlots[dayIndex][slotIndex + 3].end
    ) !== 120
  )
    return weekSlots;

  for (let i = 0; i < 4; i++)
    if (weekSlots[dayIndex][slotIndex + i].isSelected) {
      removeSchedule(weekSlots, dayIndex, slotIndex + i);
    }
  for (let i = 0; i < 4; i++)
    weekSlots[dayIndex][slotIndex + i].isSelected =
      !weekSlots[dayIndex][slotIndex + i].isSelected;
  return weekSlots;
};

export const getSelectedSessions = (weekSlots: Session[][]) => {
  const scheduledSlots: string[] = [];
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  weekSlots.forEach((day, dayIndex) => {
    for (let i = 0; i < day.length; i++) {
      if (day[i].isSelected) {
        const slotLabel = `${weekdays[dayIndex]} ${day[
          i
        ].start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
        scheduledSlots.push(slotLabel);
        i += 4;
      }
    }
  });
  return scheduledSlots;
};