import React, { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { UserStateContext } from "./context/Context";
import Nav from "./components/header/Nav";
import { Helmet } from "react-helmet";

import Routes from "./route/Routes";
import { useEffect } from "react";
import axios from "axios";

export default function App() {
  const { users, successed, setUsers, setSuccessed, usersInfo, setUsersInfo } =
    useContext(UserStateContext);
  const email = localStorage.getItem("email");
  const headers = {
    accessToken: `${localStorage.getItem("accessToken")}`,
    "Access-Control-Allow-Origin": "*",
  };

  // useEffect(() => {
  //   const userindex = async () => {
  //     // const {
  //     //   data: { data },
  //     // } = await axios
  //     await axios
  //       .get(`/api/v1/users/${email}`, {
  //         headers,
  //       })
  //       .then((res) => {
  //         console.log("시발");
  //         setUsers({
  //           ...users,
  //           email: "emaildz",
  //           nickname: "email",
  //           userName: "email",
  //           id: 2,
  //           profileImg: " ",
  //           userInfo: "email",
  //           authority: " ",
  //         });
  //       })
  //       .catch((err) => {
  //         console.log("시이발...");
  //       });
  //     // console.log("data : ", data);
  //     // get으로 데이터 안받아와져도 그냥 작동
  //     // 그러니까 data값을 넣어도 불러오기 전부터 값이 들어가니까 오류가남.
  //     // 로그아웃을 해도 실행되니까 오류.
  //   };
  //   userindex();
  // }, [successed]);

  useEffect(() => {
    (async () => {
      await axios
        // .get(`/member/detail/${email}`, {
        // .get(`http://localhost:8080/member/api/v1/users/${email}`, {
        .get(`/api/v1/users/${email}`, {
          headers,
        })
        .then(
          (res) => {
            const datauser = res.data.data;
            console.log("res : ", res);
            console.log(datauser);
            setSuccessed(true);
            console.log("정보 출력");
            setUsers({
              ...users,
              email: datauser.email,
              nickname: datauser.nickname,
              userName: datauser.userName,
              // id: datauser.id,
              profileImg: datauser.profileImg,
              userInfo: datauser.userInfo,
              authority: datauser.authority,
            });
            setUsersInfo({
              ...usersInfo,
              email: datauser.email,
              nickname: datauser.nickname,
              userName: datauser.userName,
              authority: datauser.authority,
              userInfo: datauser.userInfo,
              profileImg: datauser.profileImg,
            });
          },
          (err) => {
            console.log(err);
          }
        );
    })();

    console.log("app.js 실행.");
  }, [successed]);

  return (
    <div className="w-screen h-screen">
      <Helmet>
        <title>Battle-Q</title>
      </Helmet>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </div>
  );
}
