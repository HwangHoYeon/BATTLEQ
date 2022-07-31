import React from "react";

function Dev() {
  return (
    <div className="w-full h-90per flex items-center bg-gray-200 flex-col">
      <div className="w-1/2 text-base text-gray-500/3 h-1/4 text-center mt-14 ">
        <p className="w-full h-10 text-5xl font-bold mb-10 opacity-70">
          Developer
        </p>
        <p className="text-gray-500">Battle-Q는 실시간 퀴즈게임 플랫폼입니다</p>
      </div>
      <div className="w-80per h-60per grid grid-cols-4 ">
        <div className="w-full h-60per">
          <img src="images/hwang.jpg" alt="Hwang" className="w-90per h-2/3" />
          <div className="w-90per h-40 mt-5">
            <span className="w-90per text-xl font-bold">황호연</span>
            <p className="w-90per mt-1 text-base text-gray-500">
              Back-End Developer
            </p>
            <p className="w-80per mt-4 text-base text-gray-500 ">
              개발 과정에서 인생의 즐거움을 찾고 있는 웰컵 주니어 개발자
            </p>
          </div>
        </div>
        <div className="w-full h-60per">
          <img src="images/go.jpg" alt="Go" className="w-90per h-2/3" />
          <div className="w-90per h-40 mt-5">
            <span className="text-xl font-bold">고승현</span>
            <p className="w-90per mt-1 text-base text-gray-500">
              Back-End Developer
            </p>
            <p className="w-80per mt-4 text-base text-gray-500 ">
              서비스백엔드 개발을 하고 있는 3년차 3.3 주니어 개발자
            </p>
          </div>
        </div>
        <div className="w-full h-60per ">
          <img src="images/kim.jpg" alt="Kim" className="w-90per h-2/3" />
          <div className="w-90per h-40 mt-5">
            <span className="text-xl font-bold">김기도</span>
            <p className="w-90per mt-1 text-base text-gray-500">
              Back-End Developer
            </p>
            <p className="w-80per mt-4 text-base text-gray-500 ">
              Web Back-End Engineer를 꿈꾸고 있는 KB데이타시스템 주니어 개발자
            </p>
          </div>
        </div>
        <div className="w-full h-60per ">
          <img src="images/shin.jpg" alt="Shin" className="w-90per h-2/3" />
          <div className="w-90per h-40 mt-5">
            <span className="text-xl font-bold">신규철</span>
            <p className="w-90per mt-1 text-base text-gray-500">
              Front-End Developer
            </p>
            <p className="w-80per mt-4 text-base text-gray-500 ">취업 준비중</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dev;
