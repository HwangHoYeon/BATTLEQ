import React from "react";
import RoomList from "./RoomList";

const TitleList = (props) => {
  console.log(props.quizRoomData);
  if (props.quizRoomData.length === 0) {
    return <h2> Found no expenses.</h2>;
  } else
    return (
      <div className="w-full h-90percent grid grid-cols-2 gap-5 px-4 p-5 overflow-x-hidden">
        {props.quizRoomData.map((quizData, index) => (
          <RoomList key={index} quizData={quizData} />
        ))}
      </div>
    );
};

export default TitleList;
