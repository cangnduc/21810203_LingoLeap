import React, { useState, useEffect } from "react";

const TestTimer = ({ duration, startTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000); // Convert minutes to milliseconds
    const now = new Date();
    const difference = end - now;

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Check if time is up
      if (
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(timer);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, duration]);

  const formatNumber = (num) => String(num).padStart(2, "0");

  return (
    <div className="fixed top-[65px] right-4 bg-white rounded-lg shadow p-3">
      <div className="text-center">
        <div className="text-sm font-medium text-gray-500 mb-1">Time Left</div>
        <div className="text-2xl font-bold">
          {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:
          {formatNumber(timeLeft.seconds)}
        </div>
      </div>
    </div>
  );
};

export default TestTimer;
