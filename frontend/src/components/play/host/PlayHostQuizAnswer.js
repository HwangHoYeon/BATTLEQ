import axios from "axios";
import React, { useEffect, useContext } from "react";

import { UserStateContext } from "../../../context/Context";
import PlayAudio from "../PlayAudio";
function PlayHostQuizAnswer() {
  const {
    hostQuizItem,
    gameIntro,
    quizItemNumber,
    gameNumber,
    quizAnswer,
    setQuizAnswer,
    quizItemIndex,
    setQuizItemIndex,
  } = useContext(UserStateContext);

  useEffect(() => {
    (async () => {
      await axios
        .get(`http://localhost:8080/api/v1/quizItem/quiz/${gameNumber}`)
        .then((res) => {
          console.log(res.data.data.length);
          const thisQuizAnswer = res.data.data[quizItemIndex];
          console.log(thisQuizAnswer);
          setQuizAnswer(thisQuizAnswer);
          setQuizItemIndex(quizItemIndex + 1);
        })
        .catch((res) => {
          console.log(res);
        });
    })();
  }, []);

  useEffect(() => {
    const answerOX = quizAnswer.answer;
    console.log(quizAnswer);
    console.log(answerOX);
    if (answerOX === "true") {
      quizAnswer.answer = "O";
    } else if (answerOX === "false") {
      quizAnswer.answer = "X";
    }
  }, [quizAnswer]);

  if (hostQuizItem.title !== null) {
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
          <div className="w-24 h-full flex justify-end"></div>
        </div>
        {hostQuizItem.type === "VOTE" ? (
          <>
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
            <div className="w-full h-1/6 flex justify-center items-center">
              <span className="text-5xl w-full h-full text-center items-center align-middle pt-6">
                정답 : {quizAnswer.answer}
              </span>
            </div>
          </>
        ) : (
          <>
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
            <div className="w-full h-1/6 flex justify-center items-center">
              <span className="text-5xl w-full h-full text-center items-center align-middle pt-6">
                정답 : {quizAnswer.answer}
              </span>
            </div>
          </>
        )}
      </div>
    );
  } else return <div></div>;
}

export default PlayHostQuizAnswer;
