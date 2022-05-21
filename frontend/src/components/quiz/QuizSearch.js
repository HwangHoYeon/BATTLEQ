import React, { useEffect, useContext } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import QuizFilter from "./QuizFilter";
import TitleList from "./quizList/TitleList";
import { UserStateContext } from "../../context/Context";
const QuizSearch = () => {
  const {
    quizSearch,
    setQuizSearch,
    quizSearchFilter,
    setQuizSearchFilter,
    quizSearchFilterCategory,
    setQuizSearchFilterCategory,
    filterCheck,
    menuQuizSearch,
    setMenuQuizSearch,
  } = useContext(UserStateContext);

  const headers = {
    accessToken: `${localStorage.getItem("accessToken")}`,
  };
  const offset = 0;

  useEffect(() => {
    const quizSearch = async () => {
      const {
        data: { data },
        // } = await axios.get("http://3.37.99.78:8080/api/v1/quiz/");
      } = await axios.get(`/api/v1/quiz?offset=${offset}&sort=DESC&userId=1`, {
        headers,
      });
      setQuizSearch(data);
    };
    quizSearch();
  }, []);
  const quizsSearch = quizSearch;

  const filterChangeHandler = (selected) => {
    setQuizSearchFilter(selected);
  };
  const filterCategoryChangeHandler = (selectedCategory) => {
    setQuizSearchFilterCategory(selectedCategory);
  };

  const quizSearchTitle = quizsSearch.filter((quizs) => {
    return quizs.name.indexOf(quizSearchFilter) !== -1;
  });
  const quizSearchCategory = quizsSearch.filter((quizs) => {
    return quizs.category.indexOf(quizSearchFilterCategory) !== -1;
  });

  const exitQuizSearch = () => {
    setMenuQuizSearch(!menuQuizSearch);
  };

  if (filterCheck) {
    setQuizSearchFilter("");
  } else if (!filterCheck) {
    setQuizSearchFilterCategory("선택");
  }

  return (
    <div class="w-full h-full bg-gray-500 bg-opacity-80 flex overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center ">
      <div class="relative px-4 w-1/2 h-3/4 py-4">
        <div class="relative rounded-lg shadow dark:bg-gray-700 w-full h-full bg-white">
          <div class="flex justify-between items-start p-3 rounded-t px-4 border-b-2 border-yellow-300">
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={exitQuizSearch}
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
            <QuizFilter
              selected={quizSearchFilter}
              selectedCategory={quizSearchFilterCategory}
              onChangeFilter={filterChangeHandler}
              onChangeCategoryFilter={filterCategoryChangeHandler}
            />{" "}
            {!filterCheck && (
              <div>
                <TitleList quizRoomData={quizSearchTitle} />
              </div>
            )}
            {filterCheck && (
              <div>
                <TitleList quizRoomData={quizSearchCategory} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuizSearch;
