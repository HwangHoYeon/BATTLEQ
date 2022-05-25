import React from "react";
import { useHistory } from "react-router";

const RoomList = (props) => {
  console.log("props : ", props);
  const history = new useHistory();
  const quizSearchClick = () => {
    history.push({
      pathname: `/room/${props.quizData.name}`,
      quizItems: props.quizData.quizItems,
    });
  };

  return (
    <div
      className="w-full h-full bg-white border-4 border-blue-600 border-opacity-60"
      onClick={quizSearchClick}
    >
      <div className="flex w-full h-full">
        <img
          className="w-48 h-full"
          src={props.quizData.thumbnail}
          // style={{ width: 120, height: 120 }}
        ></img>
        <div className="w-full flex flex-col p-2 bg-green-50">
          <p className="w-full h-1/5 border-2 mb-2 border-red-100">
            {props.quizData.name}
          </p>
          <p className="w-full h-1/5 border-2 mb-2 border-red-100">
            {props.quizData.category}
          </p>
          <p className="w-full h-3/5 border-2 border-red-100">
            {props.quizData.introduction}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomList;
