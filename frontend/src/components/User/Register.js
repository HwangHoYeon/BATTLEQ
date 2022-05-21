import React, { useState, useContext } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router";

import { UserStateContext } from "../../context/Context";
import { Link } from "react-router-dom";

export default function Register() {
  const [emailcheck, setEmailcheck] = useState("");
  const [nicknameCheck, setnicknameCheck] = useState("");
  const [overlapNicknameCheck, setOverlapNicknameCheck] = useState(false);
  const [overlapEmailCheck, setOverlapEmailCheck] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();

  const { users, setUsers, resetUser } = useContext(UserStateContext);

  const regist_handleSubmit = async (e) => {
    e.preventDefault();
    if (overlapEmailCheck === true && overlapNicknameCheck === true) {
      const data = {
        email: users.email,
        pwd: users.pwd,
        nickname: users.nickname,
        userName: users.userName,
        authority: users.authority,
        userInfo: users.userInfo,
      };

      axios
        .post("http://localhost:8080/ap1/v1/users", data)
        .then((res) => {
          console.log(res);
          history.push("/");
        })
        .catch((err) => {
          setMessage("이메일을 확인해주세요");
          console.log(err);
        });
      resetUser();
    } else {
      setMessage("중복확인 버튼을 눌러주세요");
    }
  };

  const OverlapNickname = (e) => {
    const overNickName = users.nickname;

    e.preventDefault();
    axios
      .get(`http://localhost:8080/member/validate/nickname/${overNickName}`)
      .then((res) => {
        console.log(res.status);
        setnicknameCheck("사용 가능한 닉네임 입니다.");
      })
      .catch((err) => {
        if (users.nickname === "") {
          setnicknameCheck("닉네임을 입력하세요");
        } else setnicknameCheck("이미 사용중인 닉네임 입니다.");
      });
    setOverlapNicknameCheck(true);
  };

  const OverlapEmail = (e) => {
    const overemail = users.email;
    e.preventDefault();
    axios
      // .get(`http://3.37.99.78:8080/member/validate/email/${overemail}`)
      .get(`http://localhost:8080/member/validate/email/${overemail}`)
      .then((res) => {
        console.log(res.status);
        setEmailcheck("사용 가능한 이메일 입니다.");
      })
      .catch((err) => {
        if (users.email === "") {
          setEmailcheck("이메일을 입력하세요");
        } else setEmailcheck("이미 사용중인 이메일 입니다.");
      });
    setOverlapEmailCheck(true);
  };

  let regist_error = "";
  if (message) {
    regist_error = (
      <div className="alert alert-danger" role="alert">
        {message}
      </div>
    );
  }

  let check = "";
  if (emailcheck) {
    check = (
      <div className="alert alert-danger" role="alert">
        {emailcheck}
      </div>
    );
  }
  let nickCheck = "";

  if (nicknameCheck) {
    nickCheck = (
      <div className="alert alert-danger" role="alert">
        {nicknameCheck}
      </div>
    );
  }

  return (
    <div class="w-full h-full bg-gray-500 bg-opacity-80 flex overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center ">
      <div class="relative px-4 w-1/2 h-1/2 items-center justify-center flex">
        <div class="relative w-full h-full rounded-lg shadow dark:bg-gray-700 bg-salmon">
          <div class="flex justify-between items-start p-5 rounded-t px-4"></div>
          <div className="w-full h-80 flex flex-col px-4">
            <div className="w-full h-20 mb-2">
              <label
                className="block uppercase text-white text-lg font-bold mb-2"
                htmlFor="grid-password"
              >
                이름
              </label>
              <input
                className="w-1/2 rounded-xl border-2 border-gray-200"
                required
                fullWidth
                id="userName"
                label="사용자 이름"
                name="userName"
                autoComplete="off"
                value={users.userName}
                onChange={(e) =>
                  setUsers({ ...users, userName: e.target.value })
                }
              />
            </div>
            <div className="w-full h-20 mb-3">
              <label
                className="block uppercase text-white text-lg font-bold mb-2"
                htmlFor="grid-password"
              >
                닉네임
              </label>
              <input
                className="w-1/2 rounded-xl border-2 border-gray-200"
                autoComplete="off"
                name="nickname"
                required
                fullWidth
                id="nickname"
                label="닉네임"
                value={users.nickname}
                onChange={(e) =>
                  setUsers({ ...users, nickname: e.target.value })
                }
              />
              <button
                className="w-1/2 text-base font-light  "
                onClick={OverlapNickname}
              >
                중복확인
                {nickCheck}
              </button>
            </div>
            <div className="w-full h-20 ">
              <label
                className="block uppercase text-white text-lg font-bold mb-2"
                htmlFor="grid-password"
              >
                이메일
              </label>
              <input
                className="w-1/2 rounded-xl border-2 border-gray-200"
                fullWidth
                id="email"
                label="이메일"
                name="email"
                autoComplete="off"
                value={users.email}
                onChange={(e) => setUsers({ ...users, email: e.target.value })}
              />
              <button
                className="w-1/2 text-base font-light"
                onClick={OverlapEmail}
              >
                중복확인
                {check}{" "}
              </button>
            </div>
            <div className="w-full h-20 ">
              <label
                className="block uppercase text-white text-lg font-bold mb-2"
                htmlFor="grid-password"
              >
                비밀번호
              </label>
              <input
                className="w-1/2 rounded-xl border-2 border-gray-200"
                required
                fullWidth
                name="pwd"
                label="비밀번호"
                type="password"
                id="pwd"
                autoComplete="new-password"
                value={users.pwd}
                onChange={(e) => setUsers({ ...users, pwd: e.target.value })}
              />
            </div>
            <div className="w-full text-right h-8 text-white">
              {regist_error}
            </div>
          </div>
          <div class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600  justify-center">
            <button
              data-modal-toggle="defaultModal"
              type="button"
              class="w-1/2 text-black bg-white hover:bg-blue-100 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={regist_handleSubmit}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
