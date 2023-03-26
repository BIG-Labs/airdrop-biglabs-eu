import React from "react";
import useCountdown from "../../hooks/useCountdown";
import "./Countdown.scss";
import GradientCircle from "./GradientCirle";

export const Countdown = () => {
  const END_DATE = new Date(1709677717000).toUTCString();
  const countdown = useCountdown(END_DATE);
  const [date, setDate] = React.useState(countdown.getTimeUntil());

  const updateCountdown = () => {
    const date = countdown.getTimeUntil();
    setDate(date);
  };

  React.useEffect(() => {
    setInterval(() => {
      updateCountdown();
    }, 1000 * 60);
  }, []);

  return (
    <div className="Countdown">
      <GradientCircle width={18.75} height={18.75}>
        <span>
          <b>
            {date.days ? ` ${date.days} days ` : ""}
            {date.hours ? ` ${date.hours} hours ` : ""}
          </b>
          <br></br>
          <br></br>
          <b>
            {date.minutes ? ` ${date.minutes} minutes ` : ""}
            {date.seconds ? ` ${date.seconds} seconds ` : ""}
          </b>
        </span>
      </GradientCircle>
      <br></br>
      <span>
        As laid out in{" "}
        <a
          href="https://agora.terra.money/discussion/6647-final-proposal-terra-phoenix-airdrop"
          target="_blank"
          rel="noreferrer"
        >
          Agora
        </a>
        , the airdrop window will close on {END_DATE} <br></br>
        Users are advised to make their airdrop claim before the window closes.
      </span>
    </div>
  );
};
