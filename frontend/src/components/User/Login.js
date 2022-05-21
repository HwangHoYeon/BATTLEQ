import axios from "axios";
import React, { useState, useContext } from "react";
import { Redirect, Link } from "react-router-dom";
import { useHistory } from "react-router";

import { UserStateContext } from "../../context/Context";

export default function Login() {
  const [message, setMessage] = useState("");
  const history = useHistory();

  const { users, setUsers, setSuccessed, homeAcount, setHomeAcount } =
    useContext(UserStateContext);

  const login_handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: users.email,
      pwd: users.pwd,
    };

    axios
      .post("http://localhost:8080/api/v1/users/login", data)
      .then((res) => {
        localStorage.setItem("accessToken", res.data.data);
        localStorage.setItem("email", data.email);
        localStorage.setItem("pwd", data.pwd);
        setSuccessed(true);
      })

      .catch((err) => {
        setMessage(err.response.data.message);
      });
    setHomeAcount(!homeAcount);
  };

  let login_error = "";
  if (message) {
    login_error = (
      <div className="alert alert-danger" role="alert">
        {message}
      </div>
    );
  }

  const exitAcount = () => {
    setHomeAcount(false);
  };

  const toRegist = () => {
    setHomeAcount(false);
    history.push("/register");
  };

  return (
    <div class="w-full h-full bg-gray-500 bg-opacity-80 flex overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center ">
      <div class="relative px-4 w-full max-w-2xl h-full md:h-auto">
        <div class="relative rounded-lg shadow dark:bg-gray-700 bg-salmon">
          <div class="flex justify-between items-start p-5 rounded-t px-4">
            {/* <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
              내 정보
            </h3> */}
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={exitAcount}
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
          <div className="w-full h-72 flex flex-col px-4">
            <div className="w-full h-20  mb-10">
              <label
                className="block uppercase text-white text-lg font-bold mb-2"
                htmlFor="grid-password"
              >
                Email
              </label>
              <input
                type="email"
                className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                placeholder="Email"
                style={{ transition: "all .15s ease" }}
                required
                id="email"
                name="email"
                value={users.email}
                autoComplete="off"
                autoFocus
                onChange={(e) => setUsers({ ...users, email: e.target.value })}
              />
            </div>
            <div className="w-full h-20 mb-3">
              <label
                className="block uppercase text-white text-lg font-bold mb-2"
                htmlFor="grid-password"
              >
                Password
              </label>
              <input
                type="password"
                className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                placeholder="Password"
                style={{ transition: "all .15s ease" }}
                required
                name="pwd"
                id="pwd"
                value={users.pwd}
                autoComplete="current-password"
                onChange={(e) => setUsers({ ...users, pwd: e.target.value })}
              />
            </div>
            <div className="w-full text-right h-8 text-white">
              {login_error}
              <a
                href=""
                onClick={toRegist}
                className="text-black-300 border-b-2"
              >
                <small>계정이 없으신가요?</small>
              </a>
            </div>
          </div>
          <div class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600  justify-center">
            <button
              data-modal-toggle="defaultModal"
              type="button"
              className="w-1/2 text-black bg-white hover:bg-blue-100 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-100 dark:focus:ring-blue-800"
              onClick={login_handleSubmit}
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
