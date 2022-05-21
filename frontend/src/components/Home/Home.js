import React, { useContext, useState } from "react";

import { UserStateContext } from "../../context/Context";
import MenuBar from "../header/MenuBar";
import { useHistory } from "react-router";
import ProfileGuest from "../user/ProfileGuest";
import QuizMyList from "../quiz/QuizMyList";
import QuizSearch from "../quiz/QuizSearch";
import QuizTitle from "../quiz/QuizTitle";
import QuizMake from "../quiz/QuizMake";
import Login from "../user/Login";
import Profile from "../user/Profile";

const Home = () => {
  const {
    usersInfo,
    successed,
    pin,
    setPin,
    homeMenu,
    setHomeMenu,
    resetUser,
    setSuccessed,
    homeAcount,
    setHomeAcount,
    guestProfile,
    setGuestProfile,
    menuGameMake,
    menuQuizSearch,
    quizMakeContent,
    error,
    setError,
    myProfile,
  } = useContext(UserStateContext);
  const history = useHistory();

  const clickEnter = () => {
    if (pin.length === 6 && usersInfo.nickname === "") {
      setGuestProfile(!guestProfile);
    } else if (pin !== "" && usersInfo.nickname !== "" && pin.length === 6) {
      history.push("/playUser");
    } else if (pin.length <= 5) {
      setError("PIN 6자리를 입력해주세요");
    }
  };

  let errorPrint = "";
  if (error) {
    errorPrint = (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  const menuToggle = () => {
    setHomeMenu(!homeMenu);
  };
  const acountMenuToggle = () => {
    setHomeAcount(!homeAcount);
  };

  const handleLogout = () => {
    localStorage.clear();
    resetUser();
    setSuccessed(false);
    history.push("/");
  };

  const pinChange = (e) => {
    const onlyNumber = /^[0-9]{0,13}$/;
    if (onlyNumber.test(e.target.value)) {
      setPin(e.target.value);
    }
  };

  // 로그인을 한 홈 화면
  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-1/5 h-full ">
        <div className="w-full h-20 flex justify-center items-center ">
          {successed && (
            <button
              className="w-12 h-12 text-2xl font-bold rounded-full border-red-300 border-2 bg-red-300 text-white hover:bg-red-500"
              onClick={menuToggle}
            >
              {" "}
              &#9776;
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center w-3/5 h-full">
        <div className="flex w-full h-1/3">
          <div className="flex w-4/5 h-full items-center justify-center cursor-default">
            <p className="text-yellow-500 text-center font-extrabold text-10xl uppercase">
              Battle
            </p>
          </div>
          <div className="flex w-1/5 h-full items-center cursor-default">
            <p className="text-pink-400 text-center font-extrabold text-10xl">
              Q
            </p>
          </div>
        </div>

        <div className="w-full h-1/3">
          <div className="flex w-full h-full justify-center items-center">
            <input
              type="text"
              maxLength={6}
              value={pin}
              placeholder="PIN"
              onChange={pinChange}
              className="w-2/3 h-1/3 bg-pink-50 rounded-2xl border-4 text-center placeholder:text-slate-400 font-medium text-5xl "
            />
          </div>
        </div>
        <div className="w-full h-1/3 ">
          <div className="flex w-full h-full flex-col items-center">
            {/* {pin.length !== 6 && (
              <button
                className="text-center text-gray-400 w-2/3 h-1/3 bg-pink-50 border-4 rounded-t-2xl rounded-b-2xl font-medium text-5xl cursor-default"
                disabled={true}
                onClick={clickEnter}
              >
                입장
              </button>
            )} */}
            {pin.length === 6 && (
              <button
                className="text-center text-gray-400 w-2/3 h-1/3 bg-pink-50 border-4 rounded-t-2xl rounded-b-2xl font-medium text-5xl hover:bg-pink-100"
                onClick={clickEnter}
              >
                입장
              </button>
            )}

            <span className="w-2/3 h-12 text-center mt-10 text-2xl text-red-400 font-medium">
              {errorPrint}
            </span>
          </div>
        </div>
      </div>

      <div className="w-1/5 h-full flex">
        <div className="w-full h-20 flex justify-center items-center ">
          {successed ? (
            <button
              className="w-20 h-12 text-md font-bold border-2  text-black"
              onClick={handleLogout}
            >
              {" "}
              로그아웃
            </button>
          ) : (
            <button
              className="w-20 h-12 text-md font-bold border-2  text-black"
              onClick={acountMenuToggle}
            >
              {" "}
              로그인
            </button>
          )}
        </div>
      </div>
      {homeMenu && <MenuBar />}
      {myProfile && <Profile />}
      {guestProfile && <ProfileGuest />}
      {homeAcount && <Login />}
      {menuGameMake && <QuizMyList />}
      {menuQuizSearch && <QuizSearch />}
      {quizMakeContent && <QuizMake />}
    </div>
  );
};

export default Home;
