import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";

import { UserStateContext } from "../../context/Context";

const QuizMyGameSelect = (props) => {
  const { gameNumber, setGameNumber } = useContext(UserStateContext);
  const history = useHistory();

  const quizSearchClick = () => {
    console.log("quizData", props.quizData);
    setGameNumber(1);
    history.push("/playHost");
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

export default QuizMyGameSelect;

{
  /* <div className="w-full h-full bg-white">
<table key={props.key} onClick={quizSearchClick}>
  <tr>
    <div>
      <img
        src={props.quizData.thumbnail}
        style={{ width: 120, height: 120 }}
      ></img>
      <span>{props.quizData.name}</span>
    </div>
  </tr>
  <td>{props.quizData.name}</td>
  <td>{props.quizData.name}</td>
  <td>{props.quizData.introduction}</td>
  <td>{props.quizData.category}</td>
</table>
</div> */
}
