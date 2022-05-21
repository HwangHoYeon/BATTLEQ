import React, { useContext } from "react";
import { UserStateContext } from "../../context/Context";
import { useHistory } from "react-router";

function ProfileGuest() {
  const { setGuestName, guestName, guestProfile, setGuestProfile } =
    useContext(UserStateContext);
  const history = useHistory();

  const exitProfileGuest = () => {
    setGuestProfile(!guestProfile);
  };

  const enterGame = () => {
    history.push("/playUser");
    setGuestProfile(!guestProfile);
  };

  return (
    <div class="w-full h-full bg-gray-500 bg-opacity-80 flex overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center ">
      <div class="relative px-4 w-full max-w-2xl h-1/3">
        <div class="relative rounded-lg shadow dark:bg-gray-700 bg-salmon w-full h-full ">
          <div class="flex justify-between items-start p-5 rounded-t px-4 border-b-2 border-white">
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={exitProfileGuest}
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
          <div className="w-full h-44 flex flex-col px-4 justify-around items-center">
            <div className="w-full h-1/2 mb-10">
              <label
                className="block uppercase text-white text-lg font-bold mb-2"
                htmlFor="grid-password"
              >
                게스트 닉네임
              </label>
              <div className="flex flex-col justify-center items-center">
                <input
                  type="text"
                  className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-xl shadow focus:outline-none focus:ring w-full "
                  placeholder="게스트 닉네임"
                  name="guestName"
                  value={guestName}
                  autoComplete="off"
                  autoFocus
                  onChange={(e) => setGuestName(e.target.value)}
                />
                <button
                  data-modal-toggle="defaultModal"
                  type="button"
                  className="w-1/2 text-black mt-3 bg-white hover:bg-blue-100 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-100 dark:focus:ring-blue-800"
                  onClick={enterGame}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
          <div className="w-full h-20 flex justify-center items-center">
            <button
              className="w-1/2 h-1/2 bg-white hover:bg-blue-100 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm"
              onClick={enterGame}
            >
              그냥 게스트로 접속하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileGuest;
