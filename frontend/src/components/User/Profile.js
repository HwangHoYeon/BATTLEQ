import { Helmet } from "react-helmet";

import ProfileAvatar from "./ProfileAvatar";
import ProfileDetails from "./ProfileDetails";

import { useContext } from "react";
import { UserStateContext } from "../../context/Context";
import axios from "axios";

const Profile = () => {
  const { users, myProfile, setMyProfile } = useContext(UserStateContext);

  const pwd = localStorage.getItem("pwd");

  const data = {
    authority: users.authority,
    email: users.email,
    emailAuth: "Y",
    nickname: users.nickname,
    profileImg: "string",
    pwd: pwd,
    userInfo: users.userInfo,
    userName: users.userName,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:8080/api/v1/users", data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setMyProfile(!myProfile);
  };

  return (
    <div class="w-full h-full bg-gray-500 bg-opacity-80 flex overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center ">
      <div class="relative px-4 w-full max-w-2xl h-full md:h-auto  ">
        <div class="relative rounded-lg shadow dark:bg-gray-700 bg-salmon">
          <div class="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600  ">
            <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
              내 정보
            </h3>
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setMyProfile(!myProfile)}
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
          <div class="w-full h-72 flex justify-center">
            <div className=" w-1/2 h-full">
              <ProfileAvatar users={users} />
            </div>
            <div className=" w-1/2 h-full flex justify-center items-center border-l-2 border-gray-200">
              <ProfileDetails />
            </div>
          </div>
          <div class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600  justify-center">
            <button
              data-modal-toggle="defaultModal"
              type="button"
              class="w-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleSubmit}
            >
              확인 (또는 수정)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
