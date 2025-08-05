"use client";

import { useEffect, useState } from "react";
import moment from "moment";

export default function LiveClock() {
  const [time, setTime] = useState({
    clock: moment().format("hh:mm:ss"),
    meridiem: moment().format("A"),
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const interval = setInterval(() => {
      const now = moment();
      setTime({
        clock: now.format("hh:mm"),
        meridiem: now.format("A"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative hidden sm:grid items-center justify-center">
      <div className="clock flex gap-2 items-center !text-2xl text-black">
        <span className="inline-block w-[90px] text-right">{time.clock}</span>
        <span className="inline-block w-[40px] text-left">{time.meridiem}</span>
      </div>
      <span className="text-gray-700 text-sm w-fit">
        {moment().format("dddd, MMMM D, YYYY")}
      </span>
    </div>
  );
}
