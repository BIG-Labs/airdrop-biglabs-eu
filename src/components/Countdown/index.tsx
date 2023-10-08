import { useEffect, useRef, useState } from "react";
import styles from "../Countdown/Timer.module.css";
import GradientCircle from "../Countdown/GradientCircle";

export default function Timer({
  start,
  end,
  description,
}: {
  start: number;
  end: number;
  description: string;
}) {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const FULL_DASH_ARRAY: number = 283;
  const END_DATE = new Date(1699380000000).toUTCString();
  const ref = useRef<NodeJS.Timer>();
  const [timerData, setTimerData] = useState<{
    currentTime: number;
    circleDash: number;
    timeToPass: number;
  }>({
    currentTime: start,
    circleDash: FULL_DASH_ARRAY,
    timeToPass: 0,
  });
  const [curTime, setCurTime] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>();

  const formatTime = (time: number) => {
    const seconds = time;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    setCurTime({
      days: days,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
    });
  };

  const calculateTimeFraction = () => {
    const totalTime = end - start;
    const rawTimeFraction = timerData?.timeToPass / totalTime;
    return rawTimeFraction - (1 / totalTime) * (1 - rawTimeFraction);
  };

  useEffect(() => {
    if (end === 0) return;
    if (ref.current) clearInterval(ref.current);

    const timerInterval = setInterval(() => {
      const timer = timerData;
      if (timer.timeToPass === 0) timer.timeToPass = end - currentTime;
      timer.timeToPass -= 1;
      timer.circleDash = calculateTimeFraction() * FULL_DASH_ARRAY;
      formatTime(timer.timeToPass);
      setTimerData(timer);

      if (timer.timeToPass === 0) {
        clearInterval(ref.current);
        window.location.reload();
      }
    }, 1000);
    ref.current = timerInterval;
  });

  return (
    <>
      <GradientCircle
        width={18.75}
        height={18.75}
        stroke={timerData.circleDash}
      >
        <div className={styles.content_circle}>
          <h3>{description}</h3>
          <div className={styles.content__row}>
            <div>
              <span>{curTime?.days}</span>
              <small>DAYS</small>
            </div>
            <div>
              <span>{curTime?.hours}</span>
              <small>HOURS</small>
            </div>
            <div>
              <span>{curTime?.minutes}</span>
              <small>MINUTES</small>
            </div>
            <div>
              <span>{curTime?.seconds}</span>
              <small>SECONDS</small>
            </div>
          </div>
        </div>
      </GradientCircle>
      <br></br>
      <span style={{ textAlign: "center" }}>
        As laid out in{" "}
        <a
          href="https://agora.terra.money/discussion/13006-airdrop-for-missed-protocols"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#851db7" }}
        >
          Agora
        </a>
        , the airdrop window will close on {END_DATE} <br></br>
        Users are advised to make their airdrop claim before the window closes.
      </span>
    </>
  );
}
