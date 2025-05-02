"use client";
import React, { useState } from "react";

type Hour = {
  label: string;
  start: number;
  end: number;
  disabled?: boolean;
};

type ScheduleDate = {
  day: number;
  hours: Array<Hour>;
};

const hours = [
  {
    label: "9:00 a.m. - 10:00 a.m.",
    start: 9,
    end: 10,
    disabled: false,
  },
  {
    label: "10:00 a.m. -11:00 a.m.",
    start: 10,
    end: 11,
    disabled: false,
  },
  {
    label: "11:00 a.m. - 12:00 p.m.",
    start: 11,
    end: 12,
    disabled: false,
  },
  {
    label: "12:00 p.m. - 1:00 p.m.",
    start: 12,
    end: 13,
    disabled: true,
  },
  {
    label: "1:00 p.m. - 2:00 p.m.",
    start: 13,
    end: 14,
    disabled: false,
  },
  {
    label: "2:00 p.m. - 3:00 p.m.",
    start: 14,
    end: 15,
    disabled: false,
  },
  {
    label: "3:00 p.m. - 4:00 p.m.",
    start: 15,
    end: 16,
    disabled: false,
  },
  {
    label: "4:00 p.m. - 5:00 p.m.",
    start: 16,
    end: 17,
  },
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const existsHour = (hour: Hour, selectedHours: Array<Hour>) =>
  selectedHours.some(
    (hourSelected) =>
      hourSelected.start === hour.start && hourSelected.end === hour.end
  );

const existsScheduleDate = (
  sheduleDate: { day: number; hour: Hour },
  selectedScheduleDate: Array<ScheduleDate>
) => {
  return selectedScheduleDate.some(
    (selectedScheduleDate) =>
      selectedScheduleDate.day === sheduleDate.day &&
      existsHour(sheduleDate.hour, selectedScheduleDate.hours)
  );
};

const removeDateFromSchedule = (
  sheduleDate: { day: number; hour: Hour },
  selectedScheduleDate: Array<ScheduleDate>
) => {
  return selectedScheduleDate.map((scheduleDate) => {
    if (scheduleDate.day !== sheduleDate.day) return scheduleDate;

    const existHour = (hour: Hour, hourSelected: Hour) =>
      hourSelected.start === hour.start && hourSelected.end === hour.end;

    return {
      ...scheduleDate,
      hours: scheduleDate.hours.filter(
        (hourSelected) => !existHour(sheduleDate.hour, hourSelected)
      ),
    };
  });
};

const addDateToSchedule = (
  sheduleDate: { day: number; hour: Hour },
  selectedScheduleDate: Array<ScheduleDate>
) => {
  const isScheduleDate = selectedScheduleDate.find(
    (scheduleDate) => scheduleDate.day === sheduleDate.day
  );

  if (isScheduleDate) {
    return selectedScheduleDate.map((scheduleDate) => {
      if (scheduleDate.day !== sheduleDate.day) return scheduleDate;

      return {
        ...scheduleDate,
        hours: [...scheduleDate.hours, sheduleDate.hour],
      };
    });
  }

  return [
    ...selectedScheduleDate,
    { day: sheduleDate.day, hours: [sheduleDate.hour] },
  ];
};

export const SchedulesCalendar = () => {
  const [scheduleDates, setScheduleDates] = useState<Array<ScheduleDate>>([]);

  const handleDateClick = (day: number, hour: Hour) => {
    if (hour.disabled) return;

    setScheduleDates((prevScheduleDates) => {
      const isSelected = existsScheduleDate({ day, hour }, prevScheduleDates);

      if (isSelected) {
        return removeDateFromSchedule({ day, hour }, prevScheduleDates);
      }

      return addDateToSchedule({ day, hour }, prevScheduleDates);
    });
  };

  return (
    <div className={`grid grid-cols-7 grid-rows-8 auto-cols-fr w-screen`}>
      {days.map((day, index) => (
        <div
          key={index}
          className={`border border-gray-300 bg-gray-100 text-black p-2 font-bold`}
        >
          {day}
        </div>
      ))}

      {hours.map((hour, hourIndex) => (
        <React.Fragment key={hourIndex}>
          {days.map((_, dayIndex) => (
            <div
              key={`${dayIndex}-${hourIndex}`}
              className={`border border-gray-300 text-black p-2 cursor-pointer hover:border-red ${
                hour.disabled
                  ? "bg-gray-200"
                  : existsScheduleDate({ day: dayIndex, hour }, scheduleDates)
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
              onClick={
                hour.disabled
                  ? undefined
                  : () => handleDateClick(dayIndex, hour)
              }
            >
              {hour.disabled ? (
                <span className="text-gray-500">{hour.label}</span>
              ) : (
                <span>{hour.label}</span>
              )}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};
