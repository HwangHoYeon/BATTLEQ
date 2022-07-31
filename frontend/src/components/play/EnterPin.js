import React, { useContext } from "react";
import { UserStateContext } from "../../context/Context";
import { useHistory } from "react-router";
import ProfileGuest from "../user/ProfileGuest";

const EnterPin = () => {
  const { usersInfo, pin, setPin, guestProfile, setGuestProfile } =
    useContext(UserStateContext);
  const history = useHistory();

  const clickEnter = () => {
    if (pin.length === 6 && usersInfo.nickname === "") {
      setGuestProfile(!guestProfile);
    } else if (pin !== "" && usersInfo.nickname !== "" && pin.length === 6) {
      history.push("/playUser");
    }
  };

  const pinChange = (e) => {
    const onlyNumber = /^[0-9]{0,13}$/;
    if (onlyNumber.test(e.target.value)) {
      setPin(e.target.value);
    }
  };

  const enterPin = (e) => {
    if (e.key == "Enter") {
      clickEnter();
    }
  };

  return (
    <div
      className="w-full h-full flex justify-between items-center flex-col"
      style={{ backgroundImage: `url(/images/pinBackground.png)` }}
    >
      <div className="w-full h-1/5 ">
        <img
          src="images/stars.png"
          alt=""
          className="w-72 h-32 opacity-50 relative rotate-180 top-4 left-6 transform"
        />
      </div>
      <div className="relative bottom-32 w-1/3 h-3/5">
        <div className="w-full h-1/3 text-center">
          <p className="text-5xl font-bold">
            PIN번호를 <span className="text-5xl font-medium">입력 후</span>{" "}
          </p>{" "}
          <p className="text-5xl font-medium">참가하세요</p>
        </div>
        <div className="w-full h-2/3 flex justify-start items-center flex-col">
          <input
            type="text"
            className="w-96 h-20 rounded-2xl text-center text-2xl font-extrabold"
            placeholder="Game PIN"
            maxLength={6}
            onChange={pinChange}
            onKeyPress={enterPin}
          />
          {pin.length === 6 && (
            <button
              className="relative top-8 text-center text-white w-36 h-20 bg-gradient-to-r from-indigo-500 rounded-full font-medium text-2xl"
              onClick={clickEnter}
            >
              입장
            </button>
          )}
        </div>
      </div>
      {guestProfile && <ProfileGuest />}
    </div>
  );
};

export default EnterPin;
