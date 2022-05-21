import React, { useContext } from "react";
import { UserStateContext } from "../../context/Context";
const SideBar = () => {
  const { usersInfo } = useContext(UserStateContext);

  return (
    <div>
      <div>
        <p className="text-2xl text-white">
          {usersInfo.userName}으로 접속했습니다.
        </p>
      </div>
      <div>
        <p className="text-2xl text-white">[{usersInfo.nickname}]</p>
      </div>
    </div>
  );
};

export default SideBar;
