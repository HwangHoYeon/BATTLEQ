import React from "react";

const About = () => {
  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-80per h-full mt-8 flex">
        <div className="w-1/2 h-full items-end">
          <img
            src="images/aboutImage.png"
            className="w-full h-full object-cover overflow-auto relative left-40 "
          />
        </div>
        <div className="w-1/2 h-full  p-28">
          <p className="relative text-3xl right-10 w-90per top-20">
            지식과 즐거움을 동시에 잡을 수 있는 실시간 퀴즈게임!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
