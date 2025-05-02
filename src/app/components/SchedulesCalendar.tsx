"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

import React, { useRef, useState } from "react";

type Hour = {
  label: string;
  start: number;
  end: number;
  disabled?: boolean;
};

type ScheduleDate = {
  day: number;
  hour: Hour;
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

export const SchedulesCalendar = () => {
  const prevScheduleDate = useRef<ScheduleDate | null>(null);
  const [scheduleDate, setScheduleDate] = useState<ScheduleDate | null>(null);
  const [open, setOpen] = useState(false);

  const handleDateClick = (day: number, hour: Hour) => {
    if (hour.disabled) return;

    setOpen(true);

    prevScheduleDate.current = scheduleDate;
    setScheduleDate({ day, hour });
  };

  const handleContinue = async () => {
    try {
      if (!scheduleDate) return;

      // send request and wait for response
      const data = await fetch("/schedules").then((res) => {
        if (!res.ok) {
          throw new Error("Error");
        }

        return res.json();
      });

      if (!data) {
        setScheduleDate(prevScheduleDate.current);
        return;
      }
    } catch (error) {
      console.log("Error:", error);
      setScheduleDate(prevScheduleDate.current);
    }
  };

  const handleCancel = () => {
    setScheduleDate(prevScheduleDate.current);
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleContinue}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              <button
                key={`${dayIndex}-${hourIndex}`}
                className={`border border-gray-300 text-black p-2 cursor-pointer hover:border-red disabled:bg-gray-200 ${
                  scheduleDate?.day === dayIndex &&
                  scheduleDate?.hour.start === hour.start &&
                  scheduleDate?.hour.end === hour.end
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
                disabled={hour.disabled}
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
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};
