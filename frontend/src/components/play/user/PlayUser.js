import React, { useEffect, useRef, useState, useContext } from "react";
import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { UserStateContext } from "../../../context/Context";
import PlayChat from "../PlayChat";
import PlayUserStart from "./PlayUserStart";
import PlayUserMyScore from "./PlayUserMyScore";
import PlayUserProgress from "./PlayUserProgress";
import PlayUserFinish from "./PlayUserFinish";
import PlayUserStageFinish from "./PlayUserStageFinish";
import PlayUserSendCheck from "./PlayUserSendCheck";

import PlayAudio from "../PlayAudio";
import PlayUserLoading from "./PlayUserLoading";
import { useHistory } from "react-router-dom";

const PlayUser = () => {
  const client = useRef({});
  const [message, setMessage] = useState("");

  const {
    chatMessages,
    setChatMessages,
    pin,
    statusCheck,
    setStatusCheck,
    userQuizItem,
    setUserQuizItem,
    userAnswer,
    setUserAnswer,
    resetAnswer,
    setUserScore,
    setUserSession,
    userSession,
    users,
    setUsers,
    setMiddleScore,
    setuserLoading,
    gameIntro,
    setGameIntro,
    setQuizItemIdCount,
    setQuizItemNumber,
    setGameNumber,
    setGameTimeout,
    guestName,
    setGuestName,
    middleScoreSum,
    error,
    setError,
    chating,
    setChating,
  } = useContext(UserStateContext);

  const history = new useHistory();

  useEffect(() => {
    userConnect(pin);
  }, []);

  const userConnect = (pin) => {
    if (pin !== "") {
      client.current = new StompJs.Client({
        // brokerURL: "ws://localhost:8080/ws-stomp/websocket", // 웹소켓 서버로 직접 접속
        webSocketFactory: () => new SockJS("/connect"), // proxy를 통한 접속
        connectHeaders: {
          "auth-token": "spring-chat-auth-token",
        },
        debug: (str) => {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          userSubscribe(pin);
        },
        onStompError: (frame) => {
          console.error(frame);
        },
      });
      client.current.activate();
    }
  };

  useEffect(() => {
    for (let i = 0; i < chatMessages.length; i++) {
      if (chatMessages[i] > 0) {
        setGameNumber(chatMessages[i]);
      }
    }
  }, [chatMessages]);

  const userSubscribe = (pin) => {
    client.current.subscribe(`/user/sub/message`, ({ body }) => {
      let message = JSON.parse(body);
      console.log("message : ", message);
      if (message.messageType === "JOIN") {
        setStatusCheck({
          ...statusCheck,
          usercheck: "true",
          gameStatus: "lobby",
        });
        setUserSession(message.message);
        setError("");
      } else if (message.messageType === "JOINFAILED") {
        setStatusCheck({
          ...statusCheck,
          usercheck: false,
          gameStatus: "joinFailed",
        });
        setError("잘못된 핀번호입니다.");

        history.push("/");
        setUsers({ ...users, nickname: "" });
        setGuestName("");
      }
    });
    console.log("playuser statusCheck : ", statusCheck);

    client.current.subscribe(`/sub/pin/${pin}`, ({ body }) => {
      let message = JSON.parse(body);
      console.log("호스트로부터 message : ", message);

      if (message.messageType === "CHAT") {
        setChatMessages((chatMessages) => [
          ...chatMessages,
          message.sender,
          message.message,
        ]);
        setChating((chating) => [
          ...chating,
          { sender: message.sender, message: message.message },
        ]);
        setStatusCheck({
          ...statusCheck,
          usercheck: "true",
          gameStatus: "lobby",
        });
      }

      if (message.message === "문제 시작.") {
        setStatusCheck({
          ...statusCheck,
          usercheck: "true",
          gameStatus: "quizLoading",
        });
      } else if (message.message === "게임에서 나갑니다.") {
        setStatusCheck({
          ...statusCheck,
          usercheck: "true",
          gameStatus: "toHome",
        });
        history.push("/");
        window.location.replace("/");
      }

      // 소켓 커넥트 (방 입장)
      else if (message.messageType === "JOIN") {
        setChatMessages((chatMessages) => [...chatMessages, message.message]);
      }

      // 게임 시작
      else if (message.messageType === "START") {
        setChatMessages((chatMessages) => [...chatMessages, message.message]);
        setGameIntro({
          ...gameIntro,
          category: message.content.category,
          introduction: message.content.introduction,
          name: message.content.name,
          quizItemId: message.content.quizItemId,
        });
        setQuizItemIdCount(message.content.quizItemId[0]);
        setQuizItemNumber((quizItemNumber) => quizItemNumber + 1);

        setStatusCheck({
          ...statusCheck,
          usercheck: "true",
          gameStatus: "gameStart",
        });
      }
      // 게임 단계 진행
      else if (message.messageType === "NEXT") {
        setChatMessages((chatMessages) => [...chatMessages, message.message]);
        setUserAnswer(null);

        setUserQuizItem({
          ...userQuizItem,
          content: message.content.content,
          title: message.content.title,
          image: message.content.image,
          limitTime: message.content.limitTime,
          type: message.content.type,
        });
        setStatusCheck({
          ...statusCheck,
          usercheck: "true",
          gameStatus: "gameStageProgress",
        });
      }

      //게임 채점
      else if (message.messageType === "GRADE") {
        setChatMessages((chatMessages) => [...chatMessages, message.message]);
        setMiddleScore(message.content);
        setStatusCheck({
          ...statusCheck,
          usercheck: "true",
          gameStatus: "gameMyScore",
        });
      }

      // 게임 단계 종료
      else if (message.messageType === "FINISH") {
        setChatMessages((chatMessages) => [...chatMessages, message.message]);
        setStatusCheck({
          ...statusCheck,
          usercheck: "true",
          gameStatus: "gameStageFinish",
        });
        setQuizItemIdCount((quizItemIdCount) => quizItemIdCount + 1);
        setQuizItemNumber((quizItemNumber) => quizItemNumber + 1);
        setGameTimeout(false);
      }
      // 게임 전체 종료
      else if (message.messageType === "END") {
        setUserScore(message.content);
        setChatMessages((chatMessages) => [...chatMessages, message.message]);

        setStatusCheck({
          ...statusCheck,
          usercheck: "true",
          gameStatus: "gameFinallyFinish",
        });
      }
    });

    if (users.nickname === "" && guestName === "") {
      const randomNumber = Math.floor(Math.random() * 100);
      users.nickname = `게스트${randomNumber} `;
    } else if (users.nickname === "" && guestName !== "") {
      users.nickname = guestName;
    }
    const msg = {
      messageType: "JOIN",
      sender: users.nickname,
    };

    client.current.publish({
      destination: `/pub/play/joinUser/${pin}`,
      body: JSON.stringify(msg),
    });
  };

  const exitGame = (pin) => {
    const msg = {
      messageType: "LEAVE",
      sender: users.nickname,
    };

    client.current.publish({
      destination: `/pub/play/exitUser/${pin}`,
      body: JSON.stringify(msg),
    });
    setStatusCheck({ ...statusCheck, gameStatus: "toHome" });
    history.push("/");
    window.location.replace("/");
  };

  const messageSend = (message) => {
    const msg = {
      messageType: "CHAT",
      content: message,
      sender: users.nickname,
    };

    if (!client.current.connected) {
      window.alert("커넥션 오류");
      return;
    }

    client.current.publish({
      destination: `/pub/play/chatRoom/${pin}`,
      body: JSON.stringify(msg),
    });
    setMessage("");
  };

  const answerSend = () => {
    if (userAnswer !== null) {
      const msg = {
        messageType: "SUBMIT",
        answer: userAnswer,
        sender: users.nickname,
      };

      if (!client.current.connected) {
        window.alert("커넥션 오류");
        return;
      }

      client.current.publish({
        destination: `/pub/play/sendAnswer/${pin}`,
        body: JSON.stringify(msg),
      });
      setuserLoading(true);
      setStatusCheck({
        ...statusCheck,
        usercheck: "true",
        gameStatus: "loading",
      });
      resetAnswer();
    }
  };

  const enterChat = (e) => {
    if (e.key == "Enter") {
      messageSend(message);
    }
  };

  console.log(statusCheck);

  if (!statusCheck.usercheck) {
    return (
      <div className="w-full h-full flex items-center justify-center  flex-col ">
        <div className="1/3 h-1/3  items-center justify-center mt-44">
          <svg
            role="status"
            class="w-60 h-60 text-blue-500 animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="1/2 h-1/4 text-center">
          <span className="text-3xl text-black font-mono font-medium">
            방을 찾는 중...
          </span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex w-full h-full bg-pink-100">
        <div className="w-1/4 h-full flex justify-around items-center flex-col">
          <div className="w-3/4 h-1/6 text-center flex flex-col justify-center bg-yellow-100 border-4 border-white mb-8">
            <span className=" text-black text-5xl font-mono ">{pin}</span>
          </div>
          <div className="w-3/4 h-1/6 text-center flex flex-col justify-center bg-yellow-100 border-4 border-white mb-8">
            <span className=" text-black text-5xl font-mono ">
              {users.nickname}
            </span>
          </div>

          <div className="w-3/4 h-1/6 text-center flex flex-col justify-center bg-yellow-100 border-4 border-white mb-8">
            {statusCheck.gameStatus === "lobby" && (
              <div className="w-full h-full">
                <button
                  className="w-full h-full bg-yellow-100 text-black hover:bg-yellow-200 text-5xl"
                  onClick={() => exitGame(pin)}
                >
                  게임 나가기
                </button>
                {/* <PlayAudio number={5} /> */}
              </div>
            )}
            {statusCheck.gameStatus !== "lobby" && (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <span className="flex justify-center w-full h-full bg-yellow-100 text-black hover:bg-yellow-200 text-5xl text-center items-center">
                  {middleScoreSum}
                </span>
                {/* <PlayAudio number={5} /> */}
              </div>
            )}
          </div>
        </div>
        <div className="w-3/4 h-full flex justify-center">
          {statusCheck.gameStatus === "lobby" && (
            <div className="w-full h-full  py-12 px-8 mr-8">
              <div className="w-full h-chat-height flex mb-4 border-4 border-white overflow-scroll overflow-x-hidden">
                <PlayChat chatMessages={chating} />
              </div>
              <div className="w-full h-14 flex ">
                <input
                  className="w-4/5 h-full bg-white text-2xl text-black"
                  label={"message"}
                  value={message}
                  fullWidth
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={enterChat}
                />
                <button
                  className="w-1/5 h-full text-center text-2xl text-white bg-indigo-900 hover:bg-indigo-700"
                  type="submit"
                  variant="contained"
                  sx={{ mt: 1, mb: 2 }}
                  onClick={() => messageSend(message)}
                >
                  보내기
                </button>
              </div>
            </div>
          )}
          {statusCheck.gameStatus === "quizLoading" && (
            <div className="w-full h-full  py-12 px-8 mr-8">
              <div className="w-full h-chat-height flex mb-4 border-4 border-white">
                <PlayUserLoading />
              </div>
            </div>
          )}
          {statusCheck.gameStatus === "gameStart" && (
            <div className="w-full h-full  py-12 px-8 mr-8">
              <div className="w-full h-chat-height flex mb-4 border-4 border-white">
                <PlayUserStart />
              </div>
            </div>
          )}
          {statusCheck.gameStatus === "gameMyScore" && (
            <div className="w-full h-full  py-12 px-8 mr-8">
              <div className="w-full h-chat-height flex mb-4 border-4 border-white">
                <PlayUserMyScore />
              </div>
            </div>
          )}
          {statusCheck.gameStatus === "gameStageProgress" && (
            <div className="w-full h-full  py-12 px-8 mr-8">
              <div className="w-full h-chat-height flex mb-4 border-4 border-white">
                <PlayUserProgress answerSend={answerSend} />
              </div>
            </div>
          )}

          {statusCheck.gameStatus === "gameStageFinish" && (
            <div className="w-full h-full  py-12 px-8 mr-8">
              <div className="w-full h-chat-height flex mb-4 border-4 border-white">
                <PlayUserStageFinish />
              </div>
            </div>
          )}

          {statusCheck.gameStatus === "gameFinallyFinish" && (
            <div className="w-full h-full  py-12 px-8 mr-8">
              <div className="w-full h-chat-height flex mb-4 border-4 border-white">
                <PlayUserFinish />
              </div>
            </div>
          )}
          {statusCheck.gameStatus === "loading" && (
            <div className="w-full h-full  py-12 px-8 mr-8">
              <div className="w-full h-chat-height flex justify-center items-center mb-4 border-4 border-white">
                <PlayUserSendCheck />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};
export default PlayUser;

//  <div>
//    <PlayAudio number={5} />
//  </div>;
