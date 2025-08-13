"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function LiveClock() {
  const [time, setTime] = useState({
    clock: moment().format("hh:mm:ss"),
    meridiem: moment().format("A"),
  });
  const [mounted, setMounted] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
      <div>
        <button aria-describedby={id} className="cursor-pointer" onClick={handleClick}>
          <div className="clock flex gap-2 items-center !text-2xl text-black">
            <span className="inline-block w-[90px] text-right">
              {time.clock}
            </span>
            <span className="inline-block w-[40px] text-left">
              {time.meridiem}
            </span>
          </div>
          <span className="text-gray-700 text-sm w-fit">
            {moment().format("dddd, MMMM D, YYYY")}
          </span>
        </button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar />
          </LocalizationProvider>
        </Popover>
      </div>
    </div>
  );
}
