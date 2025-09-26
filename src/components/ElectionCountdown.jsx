import React, { useEffect, useState } from "react";

const ElectionCountdown = ({ startDate, endDate }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      if (now < start) {
        setStatus("Election starts in");
        calculateTimeLeft(start - now);
      } else if (now >= start && now <= end) {
        setStatus("Election ends in");
        calculateTimeLeft(end - now);
      } else {
        setStatus("Election ended");
        setTimeLeft({});
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate, endDate]);

  const calculateTimeLeft = (diff) => {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg border border-blue-100 text-center w-full max-w-md">
  <h2 className="text-2xl font-bold text-blue-600 mb-4">{status}</h2>

  {status !== "Election ended" ? (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-4">
      <div className="flex flex-col items-center flex-1 min-w-[60px]">
        <span className="text-xl sm:text-3xl font-bold text-gray-900 bg-blue-100 rounded-lg px-2 sm:px-3 py-2 w-full text-center">
          {timeLeft.days}
        </span>
        <span className="text-xs sm:text-sm text-gray-600 mt-1">Days</span>
      </div>

      <div className="flex flex-col items-center flex-1 min-w-[60px]">
        <span className="text-xl sm:text-3xl font-bold text-gray-900 bg-blue-100 rounded-lg px-2 sm:px-3 py-2 w-full text-center">
          {timeLeft.hours}
        </span>
        <span className="text-xs sm:text-sm text-gray-600 mt-1">Hours</span>
      </div>

      <div className="flex flex-col items-center flex-1 min-w-[60px]">
        <span className="text-xl sm:text-3xl font-bold text-gray-900 bg-blue-100 rounded-lg px-2 sm:px-3 py-2 w-full text-center">
          {timeLeft.minutes}
        </span>
        <span className="text-xs sm:text-sm text-gray-600 mt-1">Minutes</span>
      </div>

      <div className="flex flex-col items-center flex-1 min-w-[60px]">
        <span className="text-xl sm:text-3xl font-bold text-gray-900 bg-blue-100 rounded-lg px-2 sm:px-3 py-2 w-full text-center">
          {timeLeft.seconds}
        </span>
        <span className="text-xs sm:text-sm text-gray-600 mt-1">Seconds</span>
      </div>
    </div>
  ) : (
    <p className="text-red-500 text-lg font-medium mt-3 bg-red-50 rounded-lg py-2">
      No active election
    </p>
  )}
</div>

  );
};

export default ElectionCountdown;
