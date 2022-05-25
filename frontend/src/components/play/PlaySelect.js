import React, { useContext } from "react";
import { UserStateContext } from "../../context/Context";
import SideBar from "../header/SideBar";
import { useHistory } from "react-router";

const PlaySelect = () => {
  const { gameNumber, setGameNumber, pin, setPin } =
    useContext(UserStateContext);

  const history = useHistory();

  const clickMake = () => {
    history.push("/playHost");
  };
  const clickEnter = () => {
    history.push("/playUser");
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-1/4 h-full py-20">
        <div className="w-full h-1/2 ml-8">
          <SideBar />
        </div>
        <div className="flex flex-col w-full h-1/2 ml-8">
          <div className="w-full h-full flex justify-center items-center">
            <input
              type="number"
              placeholder="게임 번호"
              value={gameNumber}
              onChange={(e) => setGameNumber(e.target.value)}
              className="w-full h-1/2 rounded-xl text-gray-700 placeholder-gray-500 text-7xl text-center"
            />
          </div>
          <div className="w-full h-full flex justify-center items-center">
            <button
              className="w-full h-full bg-indigo-900 rounded-2xl text-center text-7xl text-white hover:bg-indigo-700"
              onClick={clickMake}
            >
              게임 만들기
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center w-2/4 h-full px-4 mx-10">
        <div className="flex w-full h-full">
          <div className="flex w-full h-full items-center justify-center cursor-default ">
            <p className="text-orange-400 text-center font-extrabold text-7xl uppercase">
              이곳은 내가 만든 퀴즈
            </p>
          </div>
        </div>
      </div>
      <div className="w-1/4 h-full py-20  mr-8">
        <div className="w-full h-1/2 "></div>
        <div className="flex flex-col w-full h-1/2">
          <div className="w-full h-full flex justify-center items-center">
            <input
              type="number"
              className="w-full h-1/2 rounded-xl text-gray-700 placeholder-gray-500 text-7xl text-center"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          <div className="w-full h-full flex justify-center items-center">
            <button
              className="w-full h-full bg-indigo-900 rounded-2xl text-center text-7xl text-white hover:bg-indigo-700"
              onClick={clickEnter}
            >
              게임 참가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaySelect;
