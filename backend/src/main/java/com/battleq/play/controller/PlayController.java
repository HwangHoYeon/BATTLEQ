package com.battleq.play.controller;

import com.battleq.play.domain.dto.*;
import com.battleq.play.service.PlayService;
import com.battleq.quiz.domain.dto.response.ExceptionResponse;
import com.battleq.quiz.domain.exception.NotFoundQuizException;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class PlayController {

    private final PlayService playService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    /**
     * 호스트 입장
     */
    @MessageMapping("/play/joinHost/")
    public void joinHost(@Payload PlayMessageDto message, SimpMessageHeaderAccessor headerAccessor) throws NotFoundQuizException, JsonProcessingException {
        playService.joinHost(message,headerAccessor);
    }

    /**
     * 호스트 퇴장
     */
    @MessageMapping("/play/exitHost/{pin}")
    public void exitHost(@DestinationVariable("pin") int pin, @Payload PlayMessageDto message, SimpMessageHeaderAccessor headerAccessor){
        playService.exitHost(pin,message,headerAccessor);
    }

    /**
     * 채팅
     */
    @MessageMapping("/play/chatRoom/{pin}")
    public void chatRoom(@DestinationVariable("pin")int pin, @Payload PlayMessageDto message, SimpMessageHeaderAccessor headerAccessor){
        playService.chatRoom(pin,message,headerAccessor);
    }

    /**
     * 유저 입장
     */
    @MessageMapping("/play/joinUser/{pin}")
    public void joinUser(@DestinationVariable("pin") int pin, @Payload PlayMessageDto message, SimpMessageHeaderAccessor headerAccessor){
        playService.joinUser(pin,message,headerAccessor);
    }

    /**
     * 유저 퇴장
     */
    @MessageMapping("/play/exitUser/{pin}")
    public void exitUser(@DestinationVariable("pin") int pin, @Payload PlayMessageDto message, SimpMessageHeaderAccessor headerAccessor){
        playService.exitUser(pin,message,headerAccessor);
    }

    /**
     * 유저 강퇴
     */
    @MessageMapping("/play/banUser/{pin}")
    public void banUser(@DestinationVariable("pin") int pin, @Payload BanMessage message, SimpMessageHeaderAccessor headerAccessor){
        playService.banUser(pin,message,headerAccessor);
    }

    /**
     * 퀴즈 시작
     */
    @MessageMapping("/play/startQuiz/{pin}")
    public void startQuiz(@DestinationVariable("pin") int pin, @Payload PlayMessageDto message, SimpMessageHeaderAccessor headerAccessor) throws NotFoundQuizException {
        playService.startQuiz(pin,message,headerAccessor);
    }

    /**
     * 퀴즈 단계 종료
     */
    @MessageMapping("/play/finishQuiz/{pin}")
    public void finishQuiz(@DestinationVariable("pin") int pin, SimpMessageHeaderAccessor headerAccessor){
        playService.finishQuiz(pin,headerAccessor);
    }

    /**
     * 퀴즈 단계 진행
     */
    @MessageMapping("/play/nextQuiz/{pin}")
    public void nextQuiz(@DestinationVariable("pin") int pin, @Payload QuizMessage message, SimpMessageHeaderAccessor headerAccessor){
        playService.nextQuiz(pin,message,headerAccessor);
    }

    /**
     * 퀴즈 전체 종료
     */
    @MessageMapping("/play/endQuiz/{pin}")
    public void endQuiz(@DestinationVariable("pin") int pin, SimpMessageHeaderAccessor headerAccessor){
        playService.endQuiz(pin,headerAccessor);
    }

    /**
     * 퀴즈 정답 제출
     */
    @MessageMapping("/play/sendAnswer/{pin}")
    public void sendAnswer(@DestinationVariable("pin") int pin, @Payload GradingMessage message, SimpMessageHeaderAccessor headerAccessor){
        playService.sendAnswer(pin,message,headerAccessor);
    }

    /**
     * 퀴즈 채점 (HOST)
     */
    @MessageMapping("/play/gradingAnswer/{pin}")
    public void gradingAnswer(@DestinationVariable("pin") int pin, SimpMessageHeaderAccessor headerAccessor){
        playService.gradingAnswer(pin,headerAccessor);
    }

    @ExceptionHandler({NotFoundQuizException.class})
    public ExceptionResponse NotFoundQuiz(final Exception ex) {
        return new ExceptionResponse(LocalDateTime.now(), HttpStatus.NOT_FOUND, "NOT_FOUND", "퀴즈를 찾을 수 없습니다.", "/api/v1/quiz");
    }
}
