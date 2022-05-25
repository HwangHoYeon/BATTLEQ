import React, { useContext } from "react";
import { UserStateContext } from "../../../context/Context";
import PlayAudio from "../PlayAudio";

const PlayUserStart = () => {
  const { gameIntro } = useContext(UserStateContext);
  return (
    <div className="w-full h-full ">
      {/* 게임을 시작합니다. */}

      <div className="w-full h-1/5 flex justify-center items-center border-b-2 border-white">
        <span className="text-black text-5xl from-transparent">
          {gameIntro.name} 게임을 시작합니다.
        </span>
      </div>

      {/* 카테고리, 설명*/}
      <div className="flex w-full h-3/5">
        <div className="w-full h-full relative justify-center items-center">
          <img
            src="gamestartImg06.png"
            alt=""
            className="h-full w-2/3 ml-44"
            draggable="false"
          />
          <span className="absolute top-48 left-left-category text-5xl font-medium">
            {gameIntro.category}
          </span>
        </div>
        <div className="w-full h-full relative justify-center items-center">
          <img
            src="gamestartImg06.png"
            alt=""
            className="h-full w-2/3 ml-8"
            draggable="false"
          />
          <div className="absolute top-40 left-28 h-52 w-52 ml-8">
            {gameIntro.introduction}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayUserStart;
