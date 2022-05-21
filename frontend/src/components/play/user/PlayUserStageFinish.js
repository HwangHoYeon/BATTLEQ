import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { UserStateContext } from "../../../context/Context";
import PlayAudio from "../PlayAudio";

function PlayUserStageFinish() {
  const { userSession, middleScore, middleScoreSum, setMiddleScoreSum } =
    useContext(UserStateContext);

  let myScore = 0;

  for (let i = 0; i < middleScore.length; i++) {
    console.log(middleScore[i]);
    if (userSession === middleScore[i].sessionId) {
      myScore += middleScore[i].score;
    }
  }

  useEffect(() => {
    setMiddleScoreSum((middleScoreSum) => middleScoreSum + myScore);
    console.log(middleScoreSum);
  }, [myScore]);

  return (
    <div className="w-full h-full relative justify-center items-center">
      <img
        src="grade03.png"
        className="w-3/4 h-full absolute items-center left-40"
        draggable="false"
      />

      <div className="absolute w-2/5 h-2/3 top-40 left-80 ml-12 p-16 items-center text-center">
        {middleScore.map((score, index) => (
          <>
            {score.score !== 0 && (
              <ul>
                <li className="text-2xl">
                  {score.owner}님이 {score.score}점으로 {score.rank}등입니다.
                </li>
              </ul>
            )}
            {score.score === 0 && (
              <ul>
                <span className="text-2xl">정답자가 아무도 없네요</span>
              </ul>
            )}
          </>
        ))}
        <div className="absolute bottom-16 w-full h-20 bg-yellow-200 rounded-2xl border-4 border-pink-300 text-center items-center justify-center left-8">
          {middleScore.map((score, index) => (
            <ul>
              {userSession === score.sessionId && (
                <h1 className="text-3xl mt-3">
                  {score.owner}님 총 {middleScoreSum}점입니다.
                </h1>
              )}
            </ul>
          ))}
        </div>
      </div>
      <img
        src="grade04.png"
        alt=""
        className="w-1/3 h-1/3 absolute bottom-28 left-9 animate-spin-slow"
        draggable="false"
      />
    </div>
  );
}

export default PlayUserStageFinish;
