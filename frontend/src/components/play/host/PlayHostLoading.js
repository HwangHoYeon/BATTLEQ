import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { UserStateContext } from "../../../context/Context";

function PlayHostLoading() {
  const { setQuizLoading } = useContext(UserStateContext);
  const [sec, setSec] = useState(3);
  const time = useRef(3);

  const timerId = useRef(null);

  useEffect(() => {
    timerId.current = setInterval(() => {
      setSec((time.current -= 1));
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    if (time.current <= 0) {
      setQuizLoading(true);
      clearInterval(timerId.current);
    }
  }, [sec]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <ul className="gameTimerUl">
        <li className="gameTimerLi">{time.current}</li>
      </ul>
    </div>
  );
}

export default PlayHostLoading;
