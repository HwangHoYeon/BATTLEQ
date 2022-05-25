import React, { useRef, useEffect, useContext, useState } from "react";

import { UserStateContext } from "../../../context/Context";
import PlayAudio from "../PlayAudio";
function PlayHostProgress() {
  const {
    hostQuizItem,
    gameIntro,
    quizItemNumber,
    statusCheck,
    setStatusCheck,
  } = useContext(UserStateContext);

  const [sec, setSec] = useState(10);
  const time = useRef(10);

  const timerId = useRef(null);

  useEffect(() => {
    timerId.current = setInterval(() => {
      setSec((time.current -= 1));
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    // 만약 타임 아웃이 발생했을 경우
    if (time.current <= 0) {
      setStatusCheck({
        ...statusCheck,
        hostcheck: "true",
        gameStatus: "loading",
      });
      clearInterval(timerId.current);
      // dispatch event
    }
  }, [sec]);

  if (hostQuizItem.title !== null) {
    if (hostQuizItem.type === "VOTE") {
      return (
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-1/6 flex border-b-2 border-white ">
            <div className="w-24 h-full">
              <h1 className="text-2xl p-4 flex justify-start">
                {" "}
                {quizItemNumber - 1}/{gameIntro.quizItemId.length}
              </h1>
            </div>
            <div className="w-full h-full flex justify-center items-center">
              <span className="text-4xl font-mono text-black">
                {hostQuizItem.title}
              </span>
            </div>
            <div className="w-24 h-full flex justify-end">
              <h1 className="text-6xl pr-6">{time.current}</h1>
            </div>
          </div>
          <div className="w-full h-4/6 flex border-b-2 border-white justify-center items-center">
            <img
              className="items-center align-middle mb-4"
              draggable="false"
              src={hostQuizItem.image}
              alt="문제"
              width={500}
              height={200}
            />
          </div>
          <div className="w-full h-1/6 flex items-center">
            {hostQuizItem.content.map((content, index) => (
              <ul className="inline">
                <button className="inline ml-28 w-40 h-24 text-white text-2xl rounded-lg border-solid border-2 bg-yellow-500 hover:bg-yellow-400">
                  {content}
                </button>
              </ul>
            ))}
          </div>
        </div>
      );
    }
    if (hostQuizItem.type === "OX") {
      return (
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-1/6 flex border-b-2 border-white ">
            <div className="w-24 h-full">
              <h1 className="text-2xl p-4 flex justify-start">
                {" "}
                {quizItemNumber - 1}/{gameIntro.quizItemId.length}
              </h1>
            </div>
            <div className="w-full h-full flex justify-center items-center">
              <span className="text-4xl font-mono text-black">
                {hostQuizItem.title}
              </span>
            </div>
            <div className="w-24 h-full flex justify-end">
              <h1 className="text-6xl pr-6">{time.current}</h1>
            </div>
          </div>
          <div className="w-full h-4/6 flex flex-col border-b-2 border-white text-center justify-center items-center">
            <span className="text-3xl text-black mb-6">
              {hostQuizItem.content}
            </span>
            <img
              className="items-center align-middle mb-4"
              draggable="false"
              src={hostQuizItem.image}
              alt="문제"
              width={500}
              height={200}
            />
          </div>
          <div className="w-full h-1/6 flex items-center justify-around">
            <button className="w-52 h-24 text-white text-2xl rounded-lg border-solid border-2 bg-yellow-500 hover:bg-yellow-400">
              O
            </button>
            <button className="w-52 h-24 text-white text-2xl rounded-lg border-solid border-2 bg-yellow-500 hover:bg-yellow-400">
              X
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-1/6 flex border-b-2 border-white ">
            <div className="w-24 h-full">
              <h1 className="text-2xl p-4 flex justify-start">
                {" "}
                {quizItemNumber - 1}/{gameIntro.quizItemId.length}
              </h1>
            </div>
            <div className="w-full h-full flex justify-center items-center">
              <span className="text-4xl font-mono text-black">
                {hostQuizItem.title}
              </span>
            </div>
            <div className="w-24 h-full flex justify-end">
              <h1 className="text-6xl pr-6">{time.current}</h1>
            </div>
          </div>
          <div className="w-full h-4/6 flex flex-col border-b-2 border-white text-center justify-center items-center">
            <span className="text-3xl text-black mb-6">
              {hostQuizItem.content}
            </span>

            <img
              className="items-center align-middle mb-4"
              draggable="false"
              src={hostQuizItem.image}
              alt="문제"
              width={500}
              height={200}
            />
          </div>
          <div className="w-full h-1/6 flex items-center justify-center">
            <input
              type="text"
              className="w-3/5 h-1/2 bg-white text-2xl text-black mr-4"
            />
            <button className="w-32 h-1/2 text-center text-2xl text-white bg-indigo-900 hover:bg-indigo-700">
              제출
            </button>
          </div>
        </div>
      );
    }
  } else return <div></div>;
}

export default PlayHostProgress;
