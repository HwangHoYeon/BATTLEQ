import axios from "axios";
import React, { useContext, useEffect } from "react";

import { UserStateContext } from "../../../context/Context";
function PlayHostNextQuiz() {
  const {
    hostNextQuizItem,
    setHostNextQuizItem,
    gameNumber,
    nextQuizItemIndex,
    setNextQuizItemIndex,
  } = useContext(UserStateContext);

  useEffect(() => {
    (async () => {
      await axios
        .get(`http://localhost:8080/api/v1/quizItem/quiz/${gameNumber}`)
        .then((res) => {
          console.log("nextquiz : ", res);
          const nextQuiz = res.data.data[nextQuizItemIndex];
          setNextQuizItemIndex(nextQuizItemIndex + 1);
          setHostNextQuizItem(nextQuiz);
        })
        .catch((res) => {
          console.log(res);
        });
    })();
  }, []);

  if (hostNextQuizItem.title !== null) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-1/6 flex border-b-2 border-white ">
          <div className="w-24 h-full"></div>
          <div className="w-full h-full flex justify-center items-center">
            <span className="text-4xl font-mono text-black">
              {hostNextQuizItem.title}
            </span>
          </div>
          <div className="w-24 h-full flex justify-end"></div>
        </div>
        {hostNextQuizItem.type === "VOTE" ? (
          <>
            <div className="w-full h-4/6 flex border-b-2 border-white justify-center items-center">
              <img
                className="items-center align-middle mb-4"
                draggable="false"
                src={hostNextQuizItem.image}
                alt="문제"
                width={500}
                height={200}
              />
            </div>
            <div className="w-full h-1/6 flex justify-center items-center"></div>
          </>
        ) : (
          <>
            <div className="w-full h-4/6 flex flex-col border-b-2 border-white text-center justify-center items-center">
              <span className="text-3xl text-black mb-6">
                {hostNextQuizItem.content}
              </span>

              <img
                className="items-center align-middle mb-4"
                draggable="false"
                src={hostNextQuizItem.image}
                alt="문제"
                width={500}
                height={200}
              />
            </div>
            <div className="w-full h-1/6 flex justify-center items-center"></div>
          </>
        )}
      </div>
    );
  } else return <div></div>;
}

export default PlayHostNextQuiz;
