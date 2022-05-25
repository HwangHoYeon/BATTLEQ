import React, { useContext } from "react";
import axios from "axios";

import { UserStateContext } from "../../context/Context";
import { useHistory } from "react-router";

const QuizTitle = () => {
  const history = useHistory();

  const {
    quizData,
    handleChange,
    setQuizId,
    setOwnerId,
    menuQuizMake,
    setMenuQuizMake,
    quizMakeContent,
    setQuizMakeContent,
  } = useContext(UserStateContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      accessToken: `${localStorage.getItem("accessToken")}`,
      "Access-Control-Allow-Origin": "*",
    };
    const data = {
      name: quizData.name,
      introduction: quizData.introduction,
      category: quizData.category,
      memberId: quizData.memberId,
      thumbnail: quizData.thumbnail,
    };

    axios
      .post("http://localhost:8080/api/v1/quiz", data)
      .then((res) => {
        console.log(res);

        setQuizId(res.data.id);
        setOwnerId(data.memberId);
      })
      .catch((err) => {
        console.log(err);
      });
    setMenuQuizMake(!menuQuizMake);
    // setQuizMakeContent(!quizMakeContent);
    history.push("/QuizMake");
  };

  const exitQuizMake = () => {
    setMenuQuizMake(!menuQuizMake);
  };

  return (
    <div class="w-full h-full bg-gray-400 bg-opacity-80 flex overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center ">
      <div class="relative px-4 w-1/2 h-3/4 py-4">
        <div class="relative rounded-lg shadow dark:bg-gray-700 bg-white w-full h-full">
          <div className="w-full h-full flex flex-col items-center bg-gray-50 rounded-lg">
            <div className="w-full h-1/4 flex justify-center items-center px-4 border-b-2 border-red-100">
              <span className="mr-6 text-4xl">제목</span>
              <input
                margin="normal"
                required
                fullWidth
                id="name"
                name="name"
                autoComplete="off"
                autoFocus
                value={quizData.name}
                onChange={handleChange}
                className="w-1/2 h-14 rounded-2xl text-3xl text-center border-2 border-black"
              />
            </div>
            <div className="w-full h-1/4 flex justify-center items-center px-4 border-b-2 border-red-100">
              {" "}
              <span className="mr-6 text-4xl">설명</span>
              <input
                margin="normal"
                required
                fullWidth
                name="introduction"
                id="introduction"
                autoComplete="off"
                value={quizData.introduction}
                onChange={handleChange}
                className="w-1/2 h-14 rounded-2xl text-3xl text-center border-2 border-black"
              />
            </div>

            <div className="w-full h-1/4 flex justify-center items-center px-4 border-b-2 border-red-100">
              {" "}
              <span className="mr-6 text-4xl">카테고리</span>
              <select
                name="category"
                value={quizData.category}
                onChange={handleChange}
                className="w-1/2 h-14 rounded-2xl text-3xl text-center mr-16 border-2 border-black cursor-pointer"
              >
                <option value="">선택</option>
                <option value="IT">IT</option>
                <option value="GAME">GAME</option>
                <option value="FUN">FUN</option>
              </select>
            </div>
            <div className="w-full h-1/4 flex justify-center items-center">
              {" "}
              <button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
                className="w-1/2 h-14 border-2 text-2xl rounded-xl border-black"
              >
                퀴즈 문제 제작하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTitle;
