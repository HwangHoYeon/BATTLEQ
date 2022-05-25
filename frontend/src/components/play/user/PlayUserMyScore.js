import React from "react";
import { useContext } from "react";
import { UserStateContext } from "../../../context/Context";
import PlayAudio from "../PlayAudio";

function PlayUserMyScore() {
  const { userSession, middleScore } = useContext(UserStateContext);

  console.log("middleScore", middleScore);
  console.log("userSession", userSession);
  return (
    <div className="w-full h-full relative justify-center items-center">
      <img
        src="grade03.png"
        className="w-3/4 h-full absolute items-center left-40"
        draggable="false"
      />

      <div className="absolute top-80 w-1/2 left-80 h-20 bg-yellow-200 rounded-2xl border-4 border-pink-300 text-center items-center justify-center">
        {middleScore.map((score, index) => (
          <ul>
            {userSession === score.sessionId && (
              <>
                {score.score !== 0 && (
                  <h1 className="text-3xl mt-3">
                    {score.owner} - {score.score}점을 획득하였습니다.
                  </h1>
                )}
                {score.score === 0 && (
                  <h1 className="text-3xl mt-3">틀렸습니다.</h1>
                )}
              </>
            )}
          </ul>
        ))}
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

export default PlayUserMyScore;
