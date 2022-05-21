import React from "react";

const QuizGameRoom = (props) => {
  const { location } = props;
  if (location) {
    return (
      <div>
        <div>
          <div>
            {location.quizItems.map((quizitems) => (
              <div>
                <h2 className="movie__title">제목 : {quizitems.title}</h2>
                <h2 className="movie__title">문제 : {quizitems.content}</h2>
                <h2 className="movie__title">
                  시간제한 {quizitems.limitTime}초
                </h2>
                <h2 className="movie__title">
                  {" "}
                  <img
                    className="quiz_room_img"
                    src={quizitems.image}
                    alt={quizitems.title}
                    title={quizitems.title}
                  />{" "}
                </h2>
                <h2 className="movie__title">
                  pointType : {quizitems.pointType}
                </h2>

                <h2 className="movie__title">quizId : {quizitems.quizId}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default QuizGameRoom;
