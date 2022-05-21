import React, { useContext, useEffect, useState, useRef } from "react";
import { UserStateContext } from "../../../context/Context";
import PlayAudio from "../PlayAudio";
function PlayUserProgress(props) {
  const {
    setGameTimeout,
    userQuizItem,
    handleChange,
    userAnswer,
    setUserAnswer,
    gameIntro,
    quizItemNumber,
    gameTimeout,
  } = useContext(UserStateContext);

  const [clickCount, setClickCount] = useState(0);
  const [sec, setSec] = useState(10);
  const time = useRef(10);
  const timerId = useRef(null);
  useEffect(() => {
    props.answerSend();
  }, [clickCount]);

  useEffect(() => {
    if (gameTimeout) {
      console.log("실행입니다.");
      props.answerSend();
    }
  }, [gameTimeout]);

  console.log(gameTimeout);

  const changehandler = (e) => {
    e.preventDefault();
    setUserAnswer(e.target.value);
    setClickCount(clickCount + 1);
  };

  const clickhandler = () => {
    setClickCount(clickCount + 1);
  };

  useEffect(() => {
    timerId.current = setInterval(() => {
      setSec((time.current -= 1));
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    if (time.current <= 0) {
      setUserAnswer("오답");
      setGameTimeout(true);
      clearInterval(timerId.current);
    }
  }, [sec]);

  const enterAnswer = (e) => {
    if (e.key == "Enter") {
      setClickCount(clickCount + 1);
    }
  };

  if (userQuizItem.type === "VOTE") {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-1/6 flex border-b-2 border-white ">
          <div className="w-24 h-full">
            <h1 className="text-2xl p-4 flex justify-start">
              {" "}
              {quizItemNumber}/{gameIntro.quizItemId.length}
            </h1>
          </div>
          <div className="w-full h-full flex justify-center items-center">
            <span className="text-4xl font-mono text-black">
              {userQuizItem.title}
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
            src={userQuizItem.image}
            alt="문제"
            width={500}
            height={200}
          />
        </div>
        <div className="w-full h-1/6 flex items-center justify-around">
          {userQuizItem.content.map((content, index) => (
            <ul className="inline">
              <button
                className="inline w-40 h-24 text-white text-2xl rounded-lg border-solid border-2 bg-yellow-500 hover:bg-yellow-400"
                onClick={changehandler}
                value={content}
              >
                {content}
              </button>
            </ul>
          ))}
        </div>
      </div>
    );
  }
  if (userQuizItem.type === "OX") {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-1/6 flex border-b-2 border-white ">
          <div className="w-24 h-full">
            <h1 className="text-2xl p-4 flex justify-start">
              {" "}
              {quizItemNumber}/{gameIntro.quizItemId.length}
            </h1>
          </div>
          <div className="w-full h-full flex justify-center items-center">
            <span className="text-4xl font-mono text-black">
              {userQuizItem.title}
            </span>
          </div>
          <div className="w-24 h-full flex justify-end">
            <h1 className="text-6xl pr-6">{time.current}</h1>
          </div>
        </div>
        <div className="w-full h-4/6 flex flex-col border-b-2 border-white text-center justify-center items-center">
          <span className="text-3xl text-black mb-6">
            {userQuizItem.content}
          </span>
          <img
            className="items-center align-middle mb-4"
            draggable="false"
            src={userQuizItem.image}
            alt="문제"
            width={500}
            height={200}
          />
        </div>
        <div className="w-full h-1/6 flex items-center justify-around">
          <button
            className="w-52 h-24 text-white text-2xl rounded-lg border-solid border-2 bg-yellow-500 hover:bg-yellow-400"
            onClick={changehandler}
            value={true}
          >
            O
          </button>
          <button
            className="w-52 h-24 text-white text-2xl rounded-lg border-solid border-2 bg-yellow-500 hover:bg-yellow-400"
            onClick={changehandler}
            value={false}
          >
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
              {quizItemNumber}/{gameIntro.quizItemId.length}
            </h1>
          </div>
          <div className="w-full h-full flex justify-center items-center">
            <span className="text-4xl font-mono text-black">
              {userQuizItem.title}
            </span>
          </div>
          <div className="w-24 h-full flex justify-end">
            <h1 className="text-6xl pr-6">{time.current}</h1>
          </div>
        </div>
        <div className="w-full h-4/6 flex flex-col border-b-2 border-white text-center justify-center items-center">
          <span className="text-3xl text-black mb-6">
            {userQuizItem.content}
          </span>

          <img
            className="items-center align-middle mb-4"
            draggable="false"
            src={userQuizItem.image}
            alt="문제"
            width={500}
            height={200}
          />
        </div>
        <div className="w-full h-1/6 flex items-center justify-center">
          <input
            type="text"
            value={userAnswer}
            autoFocus
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={enterAnswer}
            className="w-3/5 h-1/2 bg-white text-2xl text-black mr-4"
          />
          <button
            className="w-32 h-1/2 text-center text-2xl text-white bg-indigo-900 hover:bg-indigo-700"
            onClick={clickhandler}
          >
            제출
          </button>
        </div>
      </div>
    );
  }
}

export default PlayUserProgress;
