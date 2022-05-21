import React, { useContext } from "react";
import { useHistory } from "react-router";
import { UserStateContext } from "../../context/Context";
function MenuBar() {
  const {
    homeMenu,
    setHomeMenu,
    menuGameMake,
    setMenuGameMake,
    myProfile,
    setMyProfile,
    menuQuizSearch,
    setMenuQuizSearch,
  } = useContext(UserStateContext);
  const history = useHistory();

  return (
    <div class="flex overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center w-full h-full bg-opacity-70 bg-red-200">
      <div className="w-1/5 h-full">
        <div className="w-full h-20 flex justify-center items-center ">
          <button
            className="w-12 h-12 text-2xl font-bold rounded-full border-red-300 border-2 bg-red-300 text-white hover:bg-red-500"
            onClick={() => setHomeMenu(!homeMenu)}
          >
            {" "}
            &#9776;
          </button>
        </div>
      </div>
      <div className="w-3/5 h-full">
        <div className="w-full h-1/2 grid grid-cols-3 gap-4 mt-36 justify-center mx-10">
          <div className="w-3/4 h-40 duration-300 transform transition  hover:scale-125">
            <button
              // onClick={() => history.push("/profile")}
              onClick={() => setMyProfile(!myProfile)}
              className="w-full h-full rounded-2xl bg-orange-400"
            >
              내 정보
            </button>
          </div>
          <div className="w-3/4 h-40 duration-300 transform transition  hover:scale-125">
            <button
              onClick={() => history.push("/QuizTitle")}
              className="w-full h-full rounded-2xl bg-yellow-200"
            >
              내 퀴즈 제작
            </button>
          </div>
          <div className="w-3/4 h-40 duration-300 transform transition  hover:scale-125">
            <button
              onClick={() => setMenuGameMake(!menuGameMake)}
              className="w-full h-full rounded-2xl bg-green-200 "
            >
              게임방 만들기
            </button>
          </div>

          <div className="w-3/4 h-40 duration-300 transform transition  hover:scale-125">
            <button
              onClick={() => setMenuQuizSearch(!menuQuizSearch)}
              className="w-full h-full rounded-2xl bg-indigo-200"
            >
              퀴즈 보기
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/5 h-full"></div>
    </div>
  );
}

export default MenuBar;
