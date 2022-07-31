import { React, createContext, useState } from "react";

export const UserStateContext = createContext("");

function Context(props) {
  const [successed, setSuccessed] = useState(false);
  const [quizId, setQuizId] = useState(0);
  const [ownerId, setOwnerId] = useState(0);
  const [quizItemId, setQuizItemId] = useState(0);
  const [content, setContent] = useState([""]);
  const [quizItemCount, setQuizItemCount] = useState(0);
  const [quizItemPage, setQuizItemPage] = useState([]);
  const [quizItemPageId, setQuizItemPageId] = useState(0);
  const [quizItemPageNumber, setQuizItemPageNumber] = useState(0);
  const [quizSearch, setQuizSearch] = useState([]);
  const [quizSearchFilter, setQuizSearchFilter] = useState("");
  const [quizSearchFilterCategory, setQuizSearchFilterCategory] = useState("");
  const [filterCheck, setFilterCheck] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const [participationList, setParticipationList] = useState([]);
  const [gameSelectCheck, setGameSelectCheck] = useState(false);
  const [pin, setPin] = useState("");
  const [quizItemIdCount, setQuizItemIdCount] = useState(0);
  const [quizItemNumber, setQuizItemNumber] = useState(0);
  const [nextQuizItemIdCount, setNextQuizItemIdCount] = useState(0);
  const [gameNumber, setGameNumber] = useState("");
  const [gameEndCheck, setGameEndCheck] = useState(false);
  const [middleScoreSum, setMiddleScoreSum] = useState(0);
  const [updateQuizItemCheck, setupdateQuizItemCheck] = useState(false);
  const [addQuizItemCheck, setaddQuizItemCheck] = useState(true);
  const [quizItemNumberCheck, setquizItemNumberCheck] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizItemIndex, setQuizItemIndex] = useState(0);
  const [nextQuizItemIndex, setNextQuizItemIndex] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [homeMenu, setHomeMenu] = useState(false);
  const [myProfile, setMyProfile] = useState(false);
  const [guestProfile, setGuestProfile] = useState(false);
  const [homeAcount, setHomeAcount] = useState(false);
  const [homeRegistToggle, setHomeRegistToggle] = useState(false);
  const [menuGameMake, setMenuGameMake] = useState(false);
  const [menuQuizMake, setMenuQuizMake] = useState(false);
  const [quizMakeContent, setQuizMakeContent] = useState(false);
  const [menuQuizSearch, setMenuQuizSearch] = useState(false);
  const [error, setError] = useState("");

  const [chating, setChating] = useState([]);

  const [homeStatus, setHomeStatus] = useState({
    main: true,
    about: false,
    Services: false,
    Dev: false,
    Issue: false,
  });

  const [gameIntro, setGameIntro] = useState({
    category: "",
    introduction: "",
    name: "",
    quizItemId: "",
  });
  const [userQuizItem, setUserQuizItem] = useState({
    content: null,
    title: null,
    image: null,
    type: null,
    limitTime: null,
  });

  const [hostQuizItem, setHostQuizItem] = useState({
    content: null,
    title: null,
    image: null,
    type: null,
    limitTime: null,
  });

  const [hostNextQuizItem, setHostNextQuizItem] = useState({
    content: null,
    title: null,
    image: null,
    type: null,
    limitTime: null,
  });

  const [middleScore, setMiddleScore] = useState(null);
  const [userSession, setUserSession] = useState("");
  const [hostScore, setHostScore] = useState([]);
  const [userScore, setUserScore] = useState([]);
  const [userAnswer, setUserAnswer] = useState(null);
  const [gameTimeout, setGameTimeout] = useState(false);
  const [gameLimitTime, setGameLimitTime] = useState(0);
  const [userLoading, setuserLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [users, setUsers] = useState({
    email: "",
    pwd: "",
    nickname: "",
    userName: "",
    authority: "ROLE_ADMIN",
    userInfo: "테스트 유저입니다.",
  });

  const [usersInfo, setUsersInfo] = useState({
    email: "",
    nickname: "",
    userName: "",
    authority: "",
    userInfo: "",
    profileImg: "",
  });

  const [quizData, setQuizData] = useState({
    name: "",
    introduction: "",
    category: "",
    ownerId: 1,
    thumbnail:
      "https://blog.kakaocdn.net/dn/0mySg/btqCUccOGVk/nQ68nZiNKoIEGNJkooELF1/img.jpg",
  });

  const [quizItemData, setQuizItemData] = useState({
    answer: "",
    image:
      "http://t1.daumcdn.net/friends/prod/editor/dc8b3d02-a15a-4afa-a88b-989cf2a50476.jpg",
    limitTime: "5",
    ownerId: 1,
    pointType: "SINGLE",
    quizId: "",
    title: "",
    type: "VOTE",
  });

  const [statusCheck, setStatusCheck] = useState({
    hostcheck: false,
    usercheck: false,
    gameStatus: "",
  });

  const resetUser = () => {
    setUsers({ ...users, email: "", pwd: "", nickname: "", userName: "" });
  };

  const resetQuizItem = () => {
    setQuizItemData({
      ...quizItemData,
      answer: "",
      image:
        "http://t1.daumcdn.net/friends/prod/editor/dc8b3d02-a15a-4afa-a88b-989cf2a50476.jpg",
      pointType: "SINGLE",
      limitTime: "5",
      title: "",
      type: "VOTE",
    });
  };

  const resetQuiz = () => {
    setQuizData({
      ...quizData,
      name: "",
      introduction: "",
      category: "",
    });
  };

  const resetAnswer = () => {
    setUserAnswer("");
  };

  const resetcontent = () => {
    setContent({
      ...content,
      [0]: "",
      [1]: "",
      [2]: "",
      [3]: "",
    });
  };

  const handleChange = (event) => {
    setUsers({
      ...users,
      [event.target.name]: event.target.value,
    });
    setQuizData({
      ...quizData,
      [event.target.name]: event.target.value,
    });
    setQuizItemData({
      ...quizItemData,
      [event.target.name]: event.target.value,
    });
    setPin(event.target.value);
    setUserAnswer(event.target.value);
    setGameNumber(event.target.value);
    setGuestName(event.target.value);
  };

  const contentChange = (e) => {
    setContent({
      ...content,
      [0]: e.target.value,
      [1]: null,
      [2]: null,
      [3]: null,
    });
  };

  const voteChange1 = (e) => {
    setContent({
      ...content,
      [0]: e.target.value,
    });
  };
  const voteChange2 = (e) => {
    setContent({
      ...content,
      [1]: e.target.value,
    });
  };
  const voteChange3 = (e) => {
    setContent({
      ...content,

      [2]: e.target.value,
    });
  };
  const voteChange4 = (e) => {
    setContent({
      ...content,
      [3]: e.target.value,
    });
  };

  const store = {
    users,
    handleChange,
    setUsers,
    resetUser,
    successed,
    setSuccessed,
    quizData,
    setQuizData,
    quizId,
    setQuizId,
    ownerId,
    setOwnerId,
    quizItemData,
    setQuizItemData,
    resetQuizItem,
    setQuizItemId,
    setQuizItemCount,
    quizItemId,
    quizItemCount,
    quizItemPage,
    setQuizItemPage,
    quizItemPageId,
    setQuizItemPageId,
    quizItemPageNumber,
    setQuizItemPageNumber,
    resetQuiz,
    quizSearch,
    setQuizSearch,
    quizSearchFilter,
    setQuizSearchFilter,
    chatMessages,
    setChatMessages,
    statusCheck,
    setStatusCheck,
    gameSelectCheck,
    setGameSelectCheck,
    pin,
    setPin,
    gameIntro,
    setGameIntro,
    userQuizItem,
    setUserQuizItem,
    userAnswer,
    setUserAnswer,
    resetAnswer,
    gameTimeout,
    setGameTimeout,
    hostScore,
    setHostScore,
    userScore,
    setUserScore,
    userSession,
    setUserSession,
    gameLimitTime,
    setGameLimitTime,
    hostQuizItem,
    setHostQuizItem,
    middleScore,
    setMiddleScore,
    userLoading,
    setuserLoading,
    hostNextQuizItem,
    setHostNextQuizItem,
    quizItemIdCount,
    setQuizItemIdCount,
    nextQuizItemIdCount,
    setNextQuizItemIdCount,
    quizLoading,
    setQuizLoading,
    contentChange,
    voteChange1,
    voteChange2,
    voteChange3,
    voteChange4,
    content,
    setContent,
    resetcontent,
    quizItemNumber,
    setQuizItemNumber,
    gameEndCheck,
    setGameEndCheck,
    gameNumber,
    setGameNumber,
    usersInfo,
    setUsersInfo,
    middleScoreSum,
    setMiddleScoreSum,
    quizAnswer,
    setQuizAnswer,
    updateQuizItemCheck,
    setupdateQuizItemCheck,
    addQuizItemCheck,
    setaddQuizItemCheck,
    quizItemNumberCheck,
    setquizItemNumberCheck,
    participationList,
    setParticipationList,
    quizSearchFilterCategory,
    setQuizSearchFilterCategory,
    filterCheck,
    setFilterCheck,
    guestName,
    setGuestName,
    homeMenu,
    setHomeMenu,
    myProfile,
    setMyProfile,
    homeAcount,
    setHomeAcount,
    homeRegistToggle,
    setHomeRegistToggle,
    guestProfile,
    setGuestProfile,
    menuGameMake,
    setMenuGameMake,
    menuQuizMake,
    setMenuQuizMake,
    menuQuizSearch,
    setMenuQuizSearch,
    quizMakeContent,
    setQuizMakeContent,
    quizItemIndex,
    setQuizItemIndex,
    error,
    setError,
    chating,
    setChating,
    nextQuizItemIndex,
    setNextQuizItemIndex,
    homeStatus,
    setHomeStatus,
  };

  return (
    <UserStateContext.Provider value={store}>
      {props.children}
    </UserStateContext.Provider>
  );
}

export default Context;
