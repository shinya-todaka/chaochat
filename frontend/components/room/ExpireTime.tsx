import React, { FC, useState, useEffect } from 'react';
import { IRoom } from 'models/room';
import { Typography } from '@material-ui/core';

const dateDiffToTime = (
  expiresIn: number,
  createdAt: Date,
  now: Date,
  timerId: number,
): number => {
  const diff = createdAt.getTime() + expiresIn * 60 * 1000 - now.getTime();
  const time = diff / 1000;
  if (time < 0) {
    clearInterval(timerId);

    return 0;
  }

  return Math.floor(time);
};

const formatTimer = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const twoDigits = (counts: number) =>
    counts >= 10 ? `${counts}` : `0${counts}`;

  return `${twoDigits(minutes)}:${twoDigits(seconds)}`;
};

const ExpireTime: FC<{ room: IRoom }> = ({ room }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timerID = setInterval(() => {
      if (room.createdAt) {
        setTime(
          dateDiffToTime(
            room.expiresIn,
            room.createdAt.toDate(),
            new Date(),
            timerID,
          ),
        );
      }
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  return (
    <Typography variant="subtitle2">{`残り時間 ${formatTimer(
      time,
    )}`}</Typography>
  );
};

export default ExpireTime;
