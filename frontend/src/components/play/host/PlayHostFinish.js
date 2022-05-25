import React, { useContext } from "react";
import { useEffect, useState, useRef } from "react";
import { UserStateContext } from "../../../context/Context";
import PlayAudio from "../PlayAudio";
function PlayHostFinish() {
  const { hostScore } = useContext(UserStateContext);

  // 1초 마다 imgCount 라는 변수 이벤트가 발생했을 때 img 불러오기

  const [sec, setSec] = useState(4);
  const time = useRef(4);
  const timerId = useRef(null);
  const [aniTimer1, setAniTimer1] = useState(false);
  const [aniTimer2, setAniTimer2] = useState(false);
  const [aniTimer3, setAniTimer3] = useState(false);
  const [aniTimer4, setAniTimer4] = useState(false);

  useEffect(() => {
    timerId.current = setInterval(() => {
      setSec((time.current -= 1));
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    if (time.current === 4) {
      setAniTimer1(!aniTimer1);
    } else if (time.current === 3) {
      setAniTimer2(!aniTimer2);
    } else if (time.current === 2) {
      setAniTimer3(!aniTimer3);
    } else if (time.current === 1) {
      setAniTimer4(!aniTimer4);
    } else if (time.current <= 0) {
      clearInterval(timerId.current);
    }
  }, [sec]);

  return (
    <div className="w-full h-full relative justify-center items-center">
      <img
        src="finish05.png"
        className="w-3/4 h-full absolute items-center left-40"
        draggable="false"
      />

      <div className="absolute w-2/5 h-2/3 top-40 left-80 ml-4 p-16 items-center text-center">
        {hostScore.map((score, index) => (
          <ul>
            <li className="text-2xl">
              {score.owner}님이 {score.rank}등으로 {score.score}점입니다.
            </li>
          </ul>
        ))}
      </div>
      {aniTimer1 && (
        <img
          src="finish01.png"
          alt=""
          className="w-1/3 h-1/2 absolute bottom-8 left-9 animate-spin-slow"
          draggable="false"
        />
      )}
      {aniTimer2 && (
        <img
          src="finish02.png"
          alt=""
          className="w-48 h-1/4 absolute top-8 left-28 animate-spin-slow"
          draggable="false"
        />
      )}
      {aniTimer3 && (
        <img
          src="finish03.png"
          alt=""
          className="w-48 h-1/4 absolute top-36 right-72 animate-spin-slow"
          draggable="false"
        />
      )}
      {aniTimer4 && (
        <img
          src="finish04.png"
          alt=""
          className="w-48 h-1/4 absolute bottom-36 right-72 animate-spin-slow"
          draggable="false"
        />
      )}
    </div>
  );
}

export default PlayHostFinish;
