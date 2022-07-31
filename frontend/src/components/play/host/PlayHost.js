import React, { useEffect, useRef, useState, useContext } from "react";
import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

import PlayHostStart from "./PlayHostStart";
import PlayHostProgress from "./PlayHostProgress";
import PlayHostStageFinish from "./PlayHostStageFinish";
import PlayHostFinish from "./PlayHostFinish";
import PlayHostNextQuiz from "./PlayHostNextQuiz";
import PlayHostLoading from "./PlayHostLoading";
import PlayHostSendCheck from "./PlayHostSendCheck";
import PlayParticipationList from "./PlayParticipationList";
import PlayHostQuizAnswer from "./PlayHostQuizAnswer";
import PlayAudio from "../PlayAudio";

import { UserStateContext } from "../../../context/Context";
import PlayChat from "../PlayChat";
import { useHistory } from "react-router-dom";
const PlayHost = () => {
  const history = new useHistory();

  const client = useRef({});
  const [message, setMessage] = useState("");
  const [loadingCheck, setLoadingCheck] = useState(false);

  const {
    chatMessages,
    setChatMessages,
    statusCheck,
    setStatusCheck,
    pin,
    setPin,
    gameIntro,
    setGameIntro,
    gameTimeout,
    setGameTimeout,
    setHostScore,
    users,
    hostQuizItem,
    setHostQuizItem,
    setMiddleScore,
    quizItemIdCount,
    setQuizItemIdCount,
    quizLoading,
    setQuizLoading,
    quizItemNumber,
    setQuizItemNumber,
    gameEndCheck,
    setGameEndCheck,
    gameNumber,
    homeMenu,
    setHomeMenu,
    menuGameMake,
    setMenuGameMake,
    setParticipationList,
    chating,
    setChating,
  } = useContext(UserStateContext);
  useEffect(() => {
    hostConnect();
    return () => disconnect();
  }, []);

  useEffect(() => {
    // generate();
    setTimeout(() => {
      generate();
    }, 1100);
  }, []);

  const hostConnect = () => {
    console.log("hostConnect 실행");
    client.current = new StompJs.Client({
      // brokerURL: "ws://localhost:8080/ws-stomp/websocket", // 웹소켓 서버로 직접 접속
      webSocketFactory: () => new SockJS("/connect"), // proxy를 통한 접속

      connectHeaders: {
        "auth-token": "spring-chat-auth-token",
      },
      debug: (str) => {
        console.log("debug: function -> : ", str);
      },
      reconnectDelay: 5000, // 자동 재연결
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // 연결됬을 때 함수
      // 이 작업은 (다시) 연결한 후 실행되기 때문에 필요합니다.
      onConnect: () => {
        hostSubscribe();
      },

      // 에러처리 함수
      onStompError: (frame) => {
        console.error(frame);
      },
    });
    // 클라이언트 활성화
    client.current.activate();
    console.log("client.current : ", client.current);
  };

  const disconnect = () => {
    const msg = {
      messageType: "CHAT",
      content: "게임에서 나갑니다.",
    };

    client.current.publish({
      destination: `/pub/play/chatRoom/${pin}`,
      body: JSON.stringify(msg),
    });
    client.current.deactivate();
    window.location.replace("/");
    setPin(null);
  };

  //메시지 받아와서 메시지 타입이 generate면 if문 실행
  const hostSubscribe = () => {
    client.current.subscribe(`/user/sub/message`, ({ body }) => {
      let message = JSON.parse(body);
      console.log("실행 message : ", message);

      if (message.messageType === "GENERATE") {
        hostSubscribePin(message.pin);
        setPin(message.pin);
        setGameIntro({
          ...gameIntro,
          category: message.content.category,
          introduction: message.content.introduction,
          name: message.content.name,
          quizItemId: message.content.quizItemId,
        });
        console.log(message.content);
        // 퀴즈 번호.
        setQuizItemIdCount(message.content.quizItemId[0]);
        // 현재문제 번호.
        setQuizItemNumber((quizItemNumber) => quizItemNumber + 1);

        setGameEndCheck(false);
      }
    });
  };

  //메시지 받아와서 메시지 타입이 chat이면 chatmessages에 message 넣고 타입이 join이면 메시지 넣고
  const hostSubscribePin = (pin) => {
    client.current.subscribe(`/sub/pin/${pin}`, ({ body }) => {
      let message = JSON.parse(body);
      console.log("message = ", message);
      // 채팅
      if (message.messageType === "CHAT") {
        // 값이 0번 인덱스 부터 계속 누적
        setChatMessages((chatMessages) => [
          ...chatMessages,
          message.sender,
          message.message,
        ]);

        setChating((chating) => [
          ...chating,
          { sender: message.sender, message: message.message },
        ]);
      }
      // 소켓 커넥트 (방 입장)
      else if (message.messageType === "JOIN") {
        setChatMessages((chatMessages) => [...chatMessages, message.message]);
      } else if (message.messageType === "USERLIST") {
        setParticipationList(message.message);
      }

      // 게임 시작
      else if (message.messageType === "START") {
        setChatMessages((chatMessages) => [...chatMessages, message.message]);
      }
      // 게임 단계 진행
      else if (message.messageType === "NEXT") {
        setChatMessages((chatMessages) => [...chatMessages, message.message]);
        setHostQuizItem({
          ...hostQuizItem,
          content: message.content.content,
          title: message.content.title,
          image: message.content.image,
          limitTime: message.content.limitTime,
          type: message.content.type,
        });
        setQuizLoading(false);
        setLoadingCheck(false);
      }

      //게임 채점
      else if (message.messageType === "GRADE") {
        setChatMessages((chatMessages) => [...chatMessages, message.message]);
        setMiddleScore(message.content);
      }
      // 게임 단계 종료
      else if (message.messageType === "FINISH") {
        setChatMessages((chatMessages) => [...chatMessages, message.message]);
      }
      // 게임 전체 종료
      else if (message.messageType === "END") {
        setHostScore(message.content);
        setChatMessages((chatMessages) => [...chatMessages, message.message]);
      }
    });
  };
  console.log("chatMessages : ", chatMessages);
  console.log("chating : ", chating);
  const generate = () => {
    console.log("users : ", users);
    // 메세지 DTO (messageType, content, sender, quizNum)
    const msg = {
      messageType: "GENERATE",
      content: "GENERATE",
      sender: users.nickname,
      quizNum: gameNumber,
    };

    client.current.publish({
      destination: "/pub/play/joinHost/",
      body: JSON.stringify(msg),
    });
    setStatusCheck({ ...statusCheck, hostcheck: "true", gameStatus: "lobby" });
    console.log("generate 실행");
    console.log("msg : ", msg);
  };
  // 게임 시작
  const gameStart = (pin) => {
    const msgChat = {
      messageType: "CHAT",
      content: gameNumber,
    };
    client.current.publish({
      destination: `/pub/play/chatRoom/${pin}`,
      body: JSON.stringify(msgChat),
    });

    const msg = {
      messageType: "START",
      sender: users.nickname,
      quizNum: gameNumber,
    };
    client.current.publish({
      destination: `/pub/play/startQuiz/${pin}`,
      body: JSON.stringify(msg),
    });
    setStatusCheck({ ...statusCheck, gameStatus: "gameStart" });
  };

  const quizLoad = () => {
    const msg = {
      messageType: "CHAT",
      content: "문제 시작.",
    };

    client.current.publish({
      destination: `/pub/play/chatRoom/${pin}`,
      body: JSON.stringify(msg),
    });
    setStatusCheck({ ...statusCheck, gameStatus: "quizLoading" });
  };

  // 게임 단계 진행
  const gameStageProgress = (pin) => {
    setGameTimeout(false);
    const msg = {
      messageType: "NEXT",
      sender: users.nickname,
      quizItemId: quizItemIdCount,
    };
    client.current.publish({
      destination: `/pub/play/nextQuiz/${pin}`,
      body: JSON.stringify(msg),
    });
    console.log(quizItemIdCount);
    setStatusCheck({ ...statusCheck, gameStatus: "gameStageProgress" });
    setQuizItemIdCount(quizItemIdCount + 1);
    setQuizItemNumber((quizItemNumber) => quizItemNumber + 1);
    console.log(quizItemIdCount);
  };

  useEffect(() => {
    if (quizLoading) {
      console.log("gameStageProgress 실행");
      gameStageProgress(pin);
    }
  }, [quizLoading]);

  useEffect(() => {
    if (gameTimeout) {
      console.log("gradingAnswer 실행");
      client.current.publish({
        destination: `/pub/play/gradingAnswer/${pin}`,
      });
      setStatusCheck({
        ...statusCheck,
        hostcheck: "true",
        gameStatus: "quizAnswer",
      });
    }
  }, [gameTimeout]);

  // 게임 단계 종료
  const gameStageFinish = (pin) => {
    client.current.publish({
      destination: `/pub/play/finishQuiz/${pin}`,
    });
    setStatusCheck({ ...statusCheck, gameStatus: "gameStageFinish" });
    setGameTimeout(false);
  };

  useEffect(() => {
    if (loadingCheck) {
      console.log("gameStageFinish 실행");
      gameStageFinish(pin);
      if (gameIntro.quizItemId.length === quizItemNumber - 1) {
        setGameEndCheck(true);
      }
    }
  }, [loadingCheck]);

  const gameLobby = () => {
    const msg = {
      messageType: "CHAT",
      content: "로비로 돌아갑니다.",
    };

    client.current.publish({
      destination: `/pub/play/chatRoom/${pin}`,
      body: JSON.stringify(msg),
    });
    setStatusCheck({ ...statusCheck, gameStatus: "lobby" });
  };

  // 게임 전체 종료
  const gameFinallyFinish = (pin) => {
    client.current.publish({
      destination: `/pub/play/endQuiz/${pin}`,
    });
    setStatusCheck({ ...statusCheck, gameStatus: "gameFinallyFinish" });
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

  const gamePreview = () => {
    setStatusCheck({ ...statusCheck, gameStatus: "gameStageNextQuiz" });
  };

  const scoreboard = () => {
    setStatusCheck({ ...statusCheck, gameStatus: "gameStageFinish" });
  };

  const toHome = () => {
    const msg = {
      messageType: "CHAT",
      content: "게임에서 나갑니다.",
    };

    client.current.publish({
      destination: `/pub/play/chatRoom/${pin}`,
      body: JSON.stringify(msg),
    });
    setStatusCheck({ ...statusCheck, gameStatus: "toHome" });
    setHomeMenu(!homeMenu);
    setMenuGameMake(!menuGameMake);
    history.push("/");
    window.location.replace("/");
  };

  const toScore = () => {
    setLoadingCheck(true);
  };

  const enterChat = (e) => {
    if (e.key == "Enter") {
      messageSend(message);
    }
  };

  if (!statusCheck.hostcheck) {
    return <></>;
  } else {
    return (
      <div className="flex w-full h-full bg-pink-100">
        {statusCheck.gameStatus !== "lobby" && (
          <>
            {" "}
            {statusCheck.gameStatus === "quizLoading" && <PlayHostLoading />}
          </>
        )}
        <div className="w-1/3 h-full flex justify-center items-center flex-col ">
          <div className="w-3/4 h-1/6 text-center flex flex-col justify-center bg-yellow-100 border-4 border-white mb-8">
            <span className=" text-black text-5xl font-mono ">{pin}</span>
            <button onClick={disconnect}>게임방 없애기</button>
          </div>
          <div className="w-3/4 h-1/6 text-center flex flex-col justify-center bg-yellow-100 border-4 border-white mb-8">
            {statusCheck.gameStatus === "lobby" && (
              <div className="w-full h-full">
                <button
                  className="w-full h-full bg-yellow-100 text-black hover:bg-yellow-200 text-5xl"
                  onClick={() => gameStart(pin)}
                >
                  게임 시작
                </button>
                {/* <PlayAudio number={5} /> */}
              </div>
            )}

            {statusCheck.gameStatus === "gameStart" && (
              <div className="w-full h-full flex">
                <div className="w-1/2 h-full">
                  <button
                    className="w-full h-full bg-yellow-100 hover:bg-yellow-200 text-black text-2xl border-r-2 border-orange-400"
                    onClick={quizLoad}
                  >
                    문제 풀기
                  </button>
                </div>
                <div className="w-1/2 h-full">
                  <button
                    className="w-full h-full bg-yellow-100 hover:bg-yellow-200 text-black text-2xl"
                    onClick={() => gameLobby()}
                  >
                    로비로 돌아가기
                  </button>
                </div>
              </div>
            )}

            {statusCheck.gameStatus === "gameStageFinish" && (
              <>
                {gameEndCheck ? (
                  <div className="w-full h-full">
                    <button
                      className="w-full h-full bg-yellow-100 text-black hover:bg-yellow-200 text-5xl"
                      onClick={() => gameFinallyFinish(pin)}
                    >
                      게임종료
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-full h-full flex">
                      <div className="w-1/2 h-full">
                        <button
                          className="w-full h-full bg-yellow-100 hover:bg-yellow-200 text-black text-2xl border-r-2 border-orange-400"
                          onClick={quizLoad}
                        >
                          다음 문제
                        </button>
                      </div>
                      <div className="w-1/2 h-full">
                        <button
                          className="w-full h-full bg-yellow-100 hover:bg-yellow-200 text-black text-2xl"
                          onClick={gamePreview}
                        >
                          다음 문제 미리보기
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {statusCheck.gameStatus === "gameFinallyFinish" && (
              <div className="w-full h-full">
                <button
                  className="w-full h-full bg-yellow-100 text-black hover:bg-yellow-200 text-5xl"
                  onClick={toHome}
                >
                  게임에서 나가기
                </button>
              </div>
            )}
            {statusCheck.gameStatus === "quizAnswer" && (
              <div className="w-full h-full">
                <button
                  className="w-full h-full bg-yellow-100 text-black hover:bg-yellow-200 text-5xl"
                  onClick={toScore}
                >
                  점수 확인하기
                </button>
              </div>
            )}
            {statusCheck.gameStatus === "gameStageNextQuiz" && (
              <div className="w-full h-full">
                <button
                  className="w-full h-full bg-yellow-100 text-black hover:bg-yellow-200 text-5xl"
                  onClick={scoreboard}
                >
                  점수판으로 돌아가기
                </button>
              </div>
            )}
          </div>

          <div className="w-3/4 h-3/6 bg-yellow-100 border-4 border-white">
            <PlayParticipationList />
          </div>
        </div>

        {/* 게임 화면 (로비 - 게임종료) */}
        <div className="w-2/3 h-full flex justify-center">
          {statusCheck.gameStatus === "lobby" && (
            <div className="w-full h-full  py-12 px-8 mr-8">
              <div className="w-full h-chat-height flex mb-4 border-4 border-white overflow-scroll overflow-x-hidden">
                <PlayChat chatMessages={chating} />
                {message.message}
              </div>
              <div className="w-full h-14 flex ">
                <input
                  className="w-4/5 h-full bg-white text-2xl text-black"
                  label={"message"}
                  value={message}
                  fullWidth
                  autoFocus
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={enterChat}
                />
                <button
                  className="w-1/5 h-full text-center text-2xl text-white bg-indigo-900 hover:bg-indigo-700"
                  type="submit"
                  variant="contained"
                  sx={{ mt: 1, mb: 2 }}
                  onClick={() => messageSend(message)}
                  onKeyPresse={enterChat}
                >
                  보내기
                </button>
              </div>
            </div>
          )}

          {statusCheck.gameStatus !== "lobby" && (
            <div className="w-full h-full  py-12 px-8 mr-8">
              <div className="w-full h-chat-height flex mb-4 border-4 border-white">
                {/* 문제 들어가기 전 설명*/}
                {statusCheck.gameStatus === "gameStart" && <PlayHostStart />}

                {/* 문제 들어가기 3...2..1..초*/}
                {/* {statusCheck.gameStatus === "quizLoading" && (
                  <PlayHostLoading />
                )} */}

                {/* 시간 초과 이후 채점중...*/}
                {statusCheck.gameStatus === "loading" && <PlayHostSendCheck />}

                {/* 문제와 정답 */}
                {statusCheck.gameStatus === "quizAnswer" && (
                  <PlayHostQuizAnswer />
                )}

                {/* 다음문제 미리보기*/}
                {statusCheck.gameStatus === "gameStageNextQuiz" && (
                  <PlayHostNextQuiz />
                )}

                {/* 현재 문제 풀고 있는 컴포넌트 */}
                {statusCheck.gameStatus === "gameStageProgress" && (
                  <PlayHostProgress />
                )}

                {/* 문제 끝나고 점수 */}
                {statusCheck.gameStatus === "gameStageFinish" && (
                  <PlayHostStageFinish />
                )}

                {/* 게임 종료 */}
                {statusCheck.gameStatus === "gameFinallyFinish" && (
                  <PlayHostFinish />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default PlayHost;
