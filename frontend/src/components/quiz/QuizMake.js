import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";

import { UserStateContext } from "../../context/Context";
import axios from "axios";
import ButtonNumberList from "./makeList/ButtonNumberList";
const QuizMake = () => {
  const {
    handleChange,
    quizId,
    ownerId,
    quizItemData,
    resetQuizItem,
    setQuizItemId,
    setQuizItemCount,
    quizItemId,
    quizItemCount,
    quizItemPage,
    setQuizItemPage,
    quizItemPageId,
    resetQuiz,
    contentChange,
    voteChange1,
    voteChange2,
    voteChange3,
    voteChange4,
    content,
    resetcontent,
    setupdateQuizItemCheck,
    updateQuizItemCheck,
    setaddQuizItemCheck,
    addQuizItemCheck,
    setquizItemNumberCheck,
    quizMakeContent,
    setQuizMakeContent,
    setQuizItemData,
    homeMenu,
    setHomeMenu,
  } = useContext(UserStateContext);

  const history = useHistory();
  const [executionMake, setExecutionMake] = useState(0);

  const headers = {
    accessToken: `${localStorage.getItem("accessToken")}`,
    "Access-Control-Allow-Origin": "*",
  };

  const data = {
    answer: quizItemData.answer,
    content: Object.values(content),
    image: quizItemData.image,
    limitTime: quizItemData.limitTime,
    ownerId: ownerId,
    pointType: quizItemData.pointType,
    quizId: quizId,
    title: quizItemData.title,
    type: quizItemData.type,
  };
  console.log(data.answer);
  console.log(data.content);
  console.log(data.image);
  console.log(data.limitTime);
  console.log(data.ownerId);
  console.log(data.pointType);
  console.log(data.quizId);
  console.log(data.title);
  console.log(data.type);

  const putData = {
    answer: quizItemData.answer,
    content: Object.values(content),
    image: quizItemData.image,
    limitTime: quizItemData.limitTime,
    ownerId: ownerId,
    pointType: quizItemData.pointType,
    title: quizItemData.title,
    type: quizItemData.type,
  };

  const handleSubmit = () => {
    // 문제 만들었을 때 생성되는 res.data.id는 quizItemId 문제 만들때 마다 각각 부여.
    axios
      .post("http://localhost:8080/api/v1/quizItem", data)
      // .post("http://3.37.99.78:8080/api/v1/quizItem", data)
      .then((res) => {
        alert("문제를 만들었습니다 다음 문제를 작성하세요");
        console.log(res);
        const quizItemIdData = res.data.id;
        setQuizItemId(quizItemIdData);
        setQuizItemCount(quizItemCount + 1);
        setExecutionMake((executionMake) => executionMake + 1);
        console.log("data", data);
      })
      .catch((err) => {
        console.log(err);
      });
    resetQuizItem();
    resetcontent();
  };

  useEffect(() => {
    if (executionMake > 0) {
      const nextButton = quizItemPage.concat({
        id: quizItemPage.length,
        number: quizItemPage.length,
        quizItemId: quizItemId,
      });
      setQuizItemPage(nextButton);
    }
  }, [executionMake]);

  const updatePage = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:8080/api/v1/quizItem/${quizItemPageId}`, putData)
      .then((res) => {
        alert("수정 완료");
        console.log("수정 성공");
        console.log("현재 퀴즈아이템 아이디 : ", quizItemPageId);
        console.log("res : ", res.data);
      })
      .catch((err) => {
        console.log("수정 실패");
        console.log("data : ", data);
        console.log(err);
      });
  };

  const finish = () => {
    resetQuiz();
    setHomeMenu(!homeMenu);

    history.push("/");
    window.location.replace("/");

    // setQuizMakeContent(!quizMakeContent);
  };

  const returnMake = () => {
    resetQuizItem();
    resetcontent();
    setupdateQuizItemCheck(false);
    setaddQuizItemCheck(true);
    setquizItemNumberCheck(false);
  };

  const exitQuizMakeContent = () => {
    setQuizMakeContent(!quizMakeContent);
  };

  return (
    <div class="w-full h-full bg-gray-400 bg-opacity-80 flex overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center ">
      <div class="relative px-4 w-3/4 h-3/4 py-4">
        <div class="relative rounded-lg shadow dark:bg-gray-700 bg-white w-full h-full">
          <div className="w-full h-4/5 flex items-center bg-gray-50 border-b-2">
            <div className="w-1/5 h-full flex justify-center items-center border-r-2">
              {quizItemPage.length > 0 && <ButtonNumberList />}
            </div>
            <div className="w-3/5 h-full flex flex-col justify-center items-center border-r-2">
              <div className="w-full h-1/4   flex items-center flex-col border-b-2">
                <span className="text-3xl mb-2 mt-2">제목</span>
                <input
                  variant="outlined"
                  autoComplete="off"
                  name="title"
                  value={quizItemData.title}
                  onChange={handleChange}
                  className="w-3/4 h-14 rounded-2xl text-xl text-center border-2 border-black"
                />
              </div>
              <div className="w-full h-2/4  flex items-center flex-col justify-center border-b-2">
                {quizItemData.type === "VOTE" && (
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <span className="text-3xl mb-2 mt-2">문제</span>

                    <div className="w-full h-2/3 grid grid-cols-2 gap-3 px-3">
                      <input
                        name="content"
                        variant="outlined"
                        value={content[0]}
                        onChange={voteChange1}
                        className="w-full h-full rounded-2xl text-xl text-center border-2 border-black"
                      />
                      <input
                        name="content"
                        variant="outlined"
                        value={content[1]}
                        onChange={voteChange2}
                        className="w-full h-full rounded-2xl text-xl text-center border-2 border-black"
                      />
                      <input
                        name="content"
                        variant="outlined"
                        value={content[2]}
                        onChange={voteChange3}
                        className="w-full h-full rounded-2xl text-xl text-center border-2 border-black"
                      />
                      <input
                        name="content"
                        variant="outlined"
                        value={content[3]}
                        onChange={voteChange4}
                        className="w-full h-full rounded-2xl text-xl text-center border-2 border-black"
                      />
                    </div>
                  </div>
                )}
                {quizItemData.type !== "VOTE" && (
                  <div className="w-full h-full   flex items-center flex-col justify-center">
                    <span className="text-3xl mb-2 mt-2">문제</span>
                    <input
                      variant="outlined"
                      value={content[0]}
                      onChange={contentChange}
                      className="w-3/4 h-14 rounded-2xl text-xl text-center border-2 border-black"
                    />
                  </div>
                )}
              </div>

              <div className="w-full h-1/4 flex items-center flex-col">
                <span className="text-3xl mb-2 mt-2">정답</span>
                <input
                  name="answer"
                  variant="outlined"
                  value={quizItemData.answer}
                  onChange={handleChange}
                  className="w-3/4 h-14 rounded-2xl text-xl text-center border-2 border-black"
                />
              </div>
            </div>
            <div className="w-1/5 h-full flex items-center flex-col justify-around">
              {" "}
              <div className="w-full h-1/4   flex justify-center items-center">
                <select
                  name="type"
                  value={quizItemData.type}
                  onChange={(e) =>
                    setQuizItemData({ ...quizItemData, type: e.target.value })
                  }
                  className="w-2/3 h-1/2 text-center text-xl cursor-pointer rounded-xl border-2 border-black border-opacity-50"
                >
                  <option value="VOTE">4지선다</option>
                  <option value="CHOSUNG">초성</option>
                  <option value="OX">OX</option>
                  <option value="SHORTANSWER">주관식</option>
                </select>
              </div>
              <div className="w-full h-1/4   flex justify-center items-center">
                {" "}
                <select
                  name="limitTime"
                  value={quizItemData.limitTime}
                  onChange={(e) =>
                    setQuizItemData({
                      ...quizItemData,
                      limitTime: e.target.value,
                    })
                  }
                  // onChange={handleChange}
                  className="w-2/3 h-1/2 text-center text-xl cursor-pointer rounded-xl border-2 border-black border-opacity-50"
                >
                  <option value="5">5s</option>
                  <option value="10">10s</option>
                  <option value="15">15s</option>
                </select>
              </div>
              <div className="w-full h-1/4  flex justify-center items-center">
                {" "}
                <select
                  name="pointType"
                  value={quizItemData.pointType}
                  onChange={(e) =>
                    setQuizItemData({
                      ...quizItemData,
                      pointType: e.target.value,
                    })
                  }
                  className="w-2/3 h-1/2 text-center text-xl cursor-pointer rounded-xl border-2 border-black border-opacity-50"
                >
                  <option value="SINGLE">SINGLE</option>
                  <option value="DOUBLE">DOUBLE</option>
                </select>
              </div>
              <div className="w-full h-1/4  flex justify-center items-center">
                {" "}
                <input
                  name="image"
                  label="이미지 주소를 넣어주세요"
                  placeholder="이미지 주소를 넣어주세요"
                  variant="outlined"
                  value={quizItemData.image}
                  onChange={handleChange}
                  className="w-2/3 h-1/2 text-center text-sm rounded-xl border-2 border-black border-opacity-50"
                />
              </div>
            </div>
          </div>
          <div className="w-full h-1/5 flex justify-around items-center bg-white">
            {updateQuizItemCheck && (
              <div className="w-full h-full flex justify-around items-center">
                <button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={updatePage}
                  className="w-1/3 h-1/2 bg-pink-50 rounded-xl text-2xl border-2 border-black border-opacity-50"
                >
                  수정하기
                </button>
                <button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={returnMake}
                  className="w-1/3 h-1/2 bg-pink-50 rounded-xl text-2xl border-2 border-black border-opacity-50"
                >
                  돌아가기
                </button>
              </div>
            )}
            {addQuizItemCheck && (
              <div className="w-full h-full flex justify-around items-center">
                <button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSubmit}
                  className="w-1/3 h-1/2 bg-pink-50 rounded-xl text-2xl border-2 border-black border-opacity-50"
                >
                  문제 만들기
                </button>

                <button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={finish}
                  className="w-1/3 h-1/2 bg-pink-50 rounded-xl text-2xl border-2 border-black border-opacity-50"
                >
                  문제 등록
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizMake;
