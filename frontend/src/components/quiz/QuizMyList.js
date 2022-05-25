import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { UserStateContext } from "../../context/Context";
import axios from "axios";

import QuizMyGameSelect from "./QuizMyGameSelect";
const QuizMyList = () => {
  const {
    usersInfo,
    setQuizSearch,
    quizSearch,

    menuGameMake,
    setMenuGameMake,
  } = useContext(UserStateContext);
  const nickname = usersInfo.nickname;
  const headers = {
    accessToken: `${localStorage.getItem("accessToken")}`,
  };

  const exitGameMake = () => {
    setMenuGameMake(!menuGameMake);
  };

  const limit = 10;
  const offset = 0;

  useEffect(() => {
    (async () => {
      await axios
        .get(
          `http://localhost:8080/quiz/nick/${nickname}?offset=${offset}&sort=DESC`,
          { headers }
        )
        .then((res) => {
          console.log(res);
          setQuizSearch(res.data.data);
        })
        .catch((res) => {
          console.log(res);
        });
    })();
  }, [usersInfo.nickname]);

  if (quizSearch === undefined) {
    return (
      <div class="w-full h-full bg-gray-500 bg-opacity-80 flex overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center ">
        <div class="relative px-4 w-1/2 h-3/4 py-4">
          <div class="relative rounded-lg shadow dark:bg-gray-700 bg-white w-full h-full">
            <div class="flex justify-between items-start p-3 rounded-t px-4 border-b-2 border-yellow-300">
              <button
                type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={exitGameMake}
              >
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="w-full h-full bg-gray-100 overflow-scroll overflow-x-hidden">
              <div>
                <div className="w-full h-90percent grid grid-cols-2 gap-5 px-4 p-5 overflow-scroll overflow-x-hidden">
                  내가 만든 퀴즈가 없습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else
    return (
      <div class="w-full h-full bg-gray-500 bg-opacity-80 flex overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center ">
        <div class="relative px-4 w-1/2 h-3/4 py-4">
          <div class="relative rounded-lg shadow dark:bg-gray-700 bg-white w-full h-full">
            <div class="flex justify-between items-start p-3 rounded-t px-4 border-b-2 border-yellow-300">
              <button
                type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={exitGameMake}
              >
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="w-full h-full bg-gray-100 overflow-scroll overflow-x-hidden">
              <div>
                <div className="w-full h-90percent grid grid-cols-2 gap-5 px-4 p-5 overflow-x-hidden">
                  {quizSearch.map((quizData, index) => (
                    <QuizMyGameSelect key={index} quizData={quizData} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default QuizMyList;
