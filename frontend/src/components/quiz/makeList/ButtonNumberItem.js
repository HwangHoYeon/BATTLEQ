import React, { useContext } from "react";
import axios from "axios";
import { UserStateContext } from "../../../context/Context";

const ButtonNumberItem = ({ pageitem }) => {
  const {
    setQuizItemPageId,
    setQuizItemPageNumber,
    quizItemData,
    setQuizItemData,
    content,
    setContent,
    setupdateQuizItemCheck,
    setaddQuizItemCheck,
    setquizItemNumberCheck,
  } = useContext(UserStateContext);

  const Click_Page = async () => {
    await axios
      .get(`/api/v1/quizItem/${pageitem.quizItemId}`)
      // .get(`http://3.37.99.78:8080/api/v1/quizItem/${pageitem.quizItemId}`)
      .then((res) => {
        console.log(res);
        const info = res.data.data;

        setupdateQuizItemCheck(true);
        setaddQuizItemCheck(false);
        setquizItemNumberCheck(true);

        setQuizItemData({
          ...quizItemData,
          answer: info.answer,
          title: info.title,
          image: info.image,
          type: info.type,
          pointType: info.pointType,
          limitTime: info.limitTime,
        });

        if (info.content.length > 1) {
          for (let i = 0; i < info.content.length; i++) {
            setContent({
              ...content,
              [0]: info.content[0],
              [1]: info.content[1],
              [2]: info.content[2],
              [3]: info.content[3],
            });
          }
        } else {
          setContent({
            ...content,
            [0]: info.content[0],
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setQuizItemPageId(pageitem.quizItemId);
    setQuizItemPageNumber(pageitem.number + 1);
  };

  return (
    <button
      variant="contained"
      color="primary"
      size="large"
      onClick={Click_Page}
      className="w-full h-full rounded-xl text-2xl border-2 border-red-200"
    >
      문제 {pageitem.number + 1}
    </button>
  );
};

export default ButtonNumberItem;
