import React, { useContext } from "react";
import ButtonNumberItem from "./ButtonNumberItem";
import { UserStateContext } from "../../../context/Context";
const ButtonNumberList = () => {
  const { quizItemPage, quizItemPageNumber, quizItemNumberCheck } =
    useContext(UserStateContext);
  if (quizItemPage.length > 0) {
    return (
      <div className="w-full h-full">
        <div className="w-full h-3/4 grid grid-cols-2 gap-5 border-b-2 border-blue-200 px-4 py-4">
          {quizItemPage &&
            quizItemPage.map((pageitem) => {
              return <ButtonNumberItem key={pageitem.id} pageitem={pageitem} />;
            })}
        </div>
        <div className="w-full h-1/4  flex justify-center items-center">
          {quizItemNumberCheck && (
            <>
              {quizItemPageNumber > 0 && (
                <h2 className="text-2xl"> {quizItemPageNumber}번 문제 화면</h2>
              )}
            </>
          )}
        </div>
      </div>
    );
  } else return <div>{"  "}</div>;
};

export default ButtonNumberList;
