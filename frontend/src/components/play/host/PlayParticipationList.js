import React from "react";
import { useContext } from "react";
import { UserStateContext } from "../../../context/Context";

function PlayParticipationList() {
  const { participationList } = useContext(UserStateContext);

  if (participationList.length > 0) {
    return (
      <div>
        <div className="border-b-2 border-orange-400">
          <p className="text-center text-5xl text-black">참가자</p>
        </div>
        <div className="text-center w-full h-full text-black text-lg font-light mb-6">
          {participationList.map((participationlist, index) => (
            <ul>
              <li>{participationlist}</li>
            </ul>
          ))}
        </div>
      </div>
    );
  } else
    return (
      <div className="border-b-2 border-orange-400">
        <p className="text-center text-5xl text-black">참가자</p>
      </div>
    );
}

export default PlayParticipationList;
