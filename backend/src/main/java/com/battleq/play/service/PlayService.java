package com.battleq.play.service;

import com.battleq.play.domain.dto.*;
import com.battleq.play.domain.MessageType;
import com.battleq.play.domain.response.*;
import com.battleq.play.util.RedisUtil;
import com.battleq.quiz.domain.dto.QuizPlayDto;
import com.battleq.quiz.domain.entity.Quiz;
import com.battleq.quiz.domain.exception.NotFoundQuizException;
import com.battleq.quiz.service.QuizService;
import com.battleq.quizItem.domain.QuizPointType;
import com.battleq.quizItem.domain.dto.QuizItemPlayDto;
import com.battleq.quizItem.domain.entity.QuizItem;
import com.battleq.quizItem.service.QuizItemService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Nullable;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PlayService {

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private RedisUtil redisUtil;

    private final QuizService quizService;

    private final QuizItemService quizItemService;

    /**
     * 6자리 PIN 생성 및 중복 검사
     * 레디스로 체크해서 있나 없나 검사해야함.
     *
     * @return
     */
    private String generatePin() {
        Random random = new Random(System.currentTimeMillis());
        int range = (int) Math.pow(10, 6);
        int trim = (int) Math.pow(10, 5);

        int pin = random.nextInt(range) + trim;

        if (pin > range) {
            pin = pin - trim;
        }

        return String.valueOf(pin);
    }

    /**
     * 브로커 메시지 헤더 생성
     *
     * @param sessionId
     * @return
     */
    private MessageHeaders createHeaders(@Nullable String sessionId) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        if (sessionId != null) headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);
        return headerAccessor.getMessageHeaders();
    }

    /**
     * 호스트 입장
     */
    public void joinHost(PlayMessageDto message, SimpMessageHeaderAccessor headerAccessor) throws NotFoundQuizException, JsonProcessingException {

        // 핀번호 생성
        String pin = generatePin();
        while (redisUtil.hasKey(pin)) {
            pin = generatePin();
        }

        Quiz quiz = quizService.findOnePlayQuiz(Long.valueOf(message.getQuizNum()));
        // String quizContent = new ObjectMapper().writeValueAsString(quiz);
        List<Long> quizItemId = quiz.getQuizItems().stream().map(QuizItem::getId).collect(Collectors.toList());

        QuizPlayDto quizPlayDto = new QuizPlayDto(quiz.getName(),quiz.getCategory(), quiz.getThumbnail(), quiz.getIntroduction(), quizItemId);
        // 생성 메시지 전송
        MessageGenerateResponse responseMessage = new MessageGenerateResponse(LocalDateTime.now(), MessageType.GENERATE, pin, quizPlayDto, "/play/joinHost");

        MessageHeaders headers = createHeaders(headerAccessor.getSessionId());
        simpMessagingTemplate.convertAndSendToUser(headerAccessor.getSessionId(), "/sub/message", responseMessage, headers);

        //레디스 작업
        redisUtil.setKey(pin, headerAccessor.getSessionId());

    }

    /**
     * 호스트 퇴장
     */
    public void exitHost(int pin, PlayMessageDto message, SimpMessageHeaderAccessor headerAccessor) {

        // 퇴장 메시지 전송
        MessageStatusResponse responseMessage = new MessageStatusResponse(LocalDateTime.now(), MessageType.LEAVE, String.valueOf(pin), message.getSender(), "/play/exitHost");
        simpMessagingTemplate.convertAndSend("/pin/" + pin, responseMessage);

        //레디스 삭제
        redisUtil.deleteKey(String.valueOf(pin));
    }

    /**
     * 유저 입장
     */
    public void joinUser(int pin, PlayMessageDto message, SimpMessageHeaderAccessor headerAccessor) {

        //존재하지 않는 방일 경우
        if (!redisUtil.hasKey(String.valueOf(pin))) {
            MessageStatusResponse responseMessage = new MessageStatusResponse(LocalDateTime.now(), MessageType.JOINFAILED, String.valueOf(pin), message.getSender(), "/play/joinUser");
            MessageHeaders headers = createHeaders(headerAccessor.getSessionId());
            simpMessagingTemplate.convertAndSendToUser(headerAccessor.getSessionId(), "/sub/message", responseMessage, headers);
            return;
        }

        // 접속했을 때 초기화
        MessageChatResponse responseMessage = new MessageChatResponse(LocalDateTime.now(), MessageType.JOIN, String.valueOf(pin), message.getSender(), headerAccessor.getSessionId(), "/play/joinUser");
        MessageHeaders headers = createHeaders(headerAccessor.getSessionId());
        simpMessagingTemplate.convertAndSendToUser(headerAccessor.getSessionId(), "/sub/message", responseMessage, headers);
        headerAccessor.getSessionAttributes().put("pin", pin);

        // 유저 리스트 레디스 추가 (BAN)
        //List<String> userList = redisUtil.setUser("user_" + pin, message.getSender());
        List<UserInfoMessage> userList = redisUtil.setUser("user_" + pin, headerAccessor.getSessionId(), message.getSender());

        // 유저 리스트 전송
        String hostSessionId = redisUtil.getKey(String.valueOf(pin));
        MessageHeaders hostHeaders = createHeaders(hostSessionId);
        responseMessage = new MessageChatResponse(LocalDateTime.now(), MessageType.USERLIST, String.valueOf(pin), "", userList, "/play/userList");
        simpMessagingTemplate.convertAndSendToUser(hostSessionId, "/sub/message", responseMessage, hostHeaders);

    }

    /**
     * 유저 퇴장
     */
    public void exitUser(int pin, PlayMessageDto message, SimpMessageHeaderAccessor headerAccessor) {

        // 퇴장 알림
        MessageChatResponse responseMessage = new MessageChatResponse(LocalDateTime.now(), MessageType.LEAVE, String.valueOf(pin), message.getSender(), message.getSender() + "님이 퇴장하셨습니다.", "/play/exitUser");
        simpMessagingTemplate.convertAndSend("/sub/pin/" + pin, responseMessage);
        headerAccessor.getSessionAttributes().put("pin", pin);

        // 퇴장 레디스 데이터 삭제
        List<UserInfoMessage> userList = redisUtil.deleteUser("user_" + pin, headerAccessor.getSessionId(), message.getSender());

        // 유저 리스트 전송
        String hostSessionId = redisUtil.getKey(String.valueOf(pin));
        MessageHeaders hostHeaders = createHeaders(hostSessionId);
        responseMessage = new MessageChatResponse(LocalDateTime.now(), MessageType.USERLIST, String.valueOf(pin), "", userList, "/play/userList");
        simpMessagingTemplate.convertAndSendToUser(hostSessionId, "/sub/message", responseMessage, hostHeaders);
    }


    /**
     * 퀴즈 시작
     */
    public void startQuiz(int pin, PlayMessageDto message, SimpMessageHeaderAccessor headerAccessor) throws NotFoundQuizException {

        // 퀴즈 소개 데이터 만들기
        Quiz quiz = quizService.findOnePlayQuiz(Long.valueOf(message.getQuizNum()));
        List<Long> quizItemId = quiz.getQuizItems().stream().map(QuizItem::getId).collect(Collectors.toList());
        QuizPlayDto quizPlayDto = new QuizPlayDto(quiz.getName(),quiz.getCategory(), quiz.getThumbnail(), quiz.getIntroduction(), quizItemId);

        // 퀴즈 시작 전송 메시지
        MessageStartResponse responseMessage = new MessageStartResponse(LocalDateTime.now(), MessageType.START, String.valueOf(pin), quizPlayDto, "/play/startQuiz");
        simpMessagingTemplate.convertAndSend("/sub/pin/" + pin, responseMessage);

    }

    /**
     * 퀴즈 단계 종료
     */
    public void finishQuiz(int pin, SimpMessageHeaderAccessor headerAccessor) {

        // 퀴즈 단계 종료 메시지
        MessageStatusResponse responseMessage = new MessageStatusResponse(LocalDateTime.now(), MessageType.FINISH, String.valueOf(pin), "", "/play/finishQuiz");
        simpMessagingTemplate.convertAndSend("/sub/pin/" + pin, responseMessage);
    }

    /**
     * 퀴즈 단계 진행
     */
    public void nextQuiz(int pin, QuizMessage message, SimpMessageHeaderAccessor headerAccessor) {

        // 퀴즈 아이템 가져오기
        QuizItemPlayDto quizItem = quizItemService.findOnePlayQuizItem(Long.valueOf(message.getQuizItemId()));

        // 퀴즈 단계 진행 메시지
        MessageQuizResponse responseMessage = new MessageQuizResponse(LocalDateTime.now(), MessageType.NEXT, String.valueOf(pin), quizItem, "/play/nextQuiz");
        simpMessagingTemplate.convertAndSend("/sub/pin/" + pin, responseMessage);

        // 퀴즈 채점용 기준 데이터 삽입
        GradingMessage gradingMessage = new GradingMessage(message.getMessageType(), headerAccessor.getSessionId(), LocalDateTime.now(), "", message.getQuizItemId(), quizItem.getPoint(),quizItem.getPointType());

        // List 데이터 비우기
        redisUtil.deleteAnswerData("grading_" + pin);
        redisUtil.setAnswerData("grading_" + pin, gradingMessage);

    }

    /**
     * 퀴즈 전체 종료
     */
    public void endQuiz(int pin, SimpMessageHeaderAccessor headerAccessor) {

        // 전체 점수 계산
        ListOperations<String, QuizResultMessage> resultOperation = redisUtil.getResultData("result_" + pin);

        long size = resultOperation.size("result_" + pin);

        HashMap<String, QuizResultMessage> map = new HashMap<>();

        // 스코어별 정렬
        for (int i = 0; i < size; i++) {
            QuizResultMessage grading = resultOperation.leftPop("result_" + pin);
            // 이미 계산한번 했으면
            if (map.containsKey(grading.getSessionId())) {
                double resultScore = map.get(grading.getSessionId()).getScore() + grading.getScore();
                map.put(grading.getSessionId(), new QuizResultMessage(grading.getMessageType(), grading.getSessionId(), grading.getSender(), resultScore, 0));
                continue;
            }
            map.put(grading.getSessionId(), grading);
        }

        List<Map.Entry<String, QuizResultMessage>> entryList = new LinkedList<>(map.entrySet());
        entryList.sort(new Comparator<Map.Entry<String, QuizResultMessage>>() {
            @Override
            public int compare(Map.Entry<String, QuizResultMessage> o1, Map.Entry<String, QuizResultMessage> o2) {
                return (int) (o2.getValue().getScore() - o1.getValue().getScore());
            }
        });

        List<GradingResultMessage> resultList = new ArrayList<>();
        // 스코별 랭킹
        long rank = 1;
        for (Map.Entry<String, QuizResultMessage> entry : entryList) {
            resultList.add(new GradingResultMessage(entry.getValue().getMessageType(), entry.getValue().getScore(), rank, entry.getValue().getSender(), entry.getValue().getSessionId()));
            rank++;
        }

        // 퀴즈 전체 종료 메시지
        MessageGradingResponse responseMessage = new MessageGradingResponse(LocalDateTime.now(), MessageType.END, String.valueOf(pin), resultList, "/play/endQuiz");
        simpMessagingTemplate.convertAndSend("/sub/pin/" + pin, responseMessage);
    }

    /**
     * 퀴즈 정답
     */
    public void sendAnswer(int pin, GradingMessage message, SimpMessageHeaderAccessor headerAccessor) {

        //같은 sessionId 있는지 비교 후 있으면 안받기
        if (!redisUtil.findSessionIdWithAnswer("grading_" + pin, headerAccessor.getSessionId())) {
            // System.out.println("이미 제출한 유저 입니다.");
            return;
        }

        //문제 저장 비즈니스 로직
        message.setSessionId(headerAccessor.getSessionId());
        message.setSubmissionTime(LocalDateTime.now());
        redisUtil.setAnswerData("grading_" + pin, message);

        MessageStatusResponse responseMessage = new MessageStatusResponse(LocalDateTime.now(), MessageType.SUBMIT, String.valueOf(pin), message.getSender(), "/play/sendAnswer");
        MessageHeaders headers = createHeaders(headerAccessor.getSessionId());
        simpMessagingTemplate.convertAndSendToUser(headerAccessor.getSessionId(), "/sub/message", responseMessage, headers);

    }

    /**
     * 퀴즈 채점
     */
    public void gradingAnswer(int pin, SimpMessageHeaderAccessor headerAccessor) {

        //문제 꺼내오기
        ListOperations<String, GradingMessage> answerList = redisUtil.getAnswerData("grading_" + pin);

        GradingMessage initGrading = answerList.leftPop("grading_" + pin);
        LocalDateTime initTime = initGrading.getSubmissionTime();
        String answer = quizItemService.findOnePlayQuizItemAnswer(Long.valueOf(initGrading.getAnswer()));
        long size = answerList.size("grading_" + pin);

        /**
         * [0] 아무것도 없고 시간만 찍히는 값이
         * [1~ 100] 유저 데이터
         * 숫자가 낮으면 높은 점수 1등이 높은 점수
         * 특정 점수 ( 순위, 시간, 난이도)
         * 최종 발표에서 각 문제별 등수 보기
         */
        double score = initGrading.getScore();
        QuizPointType scoreType = initGrading.getScoreType();
        double rank = 1;

        /**
         * 기준점과 정답 비교
         * 정답이면
         * 정답이 아니면
         * 시간에서 로컬타임 빼기기
         **/
        List<GradingResultMessage> rankList = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            GradingMessage grading = answerList.leftPop("grading_" + pin);
            // 정답이 틀렸거나 스코어 타입이 zero (연습문제)인 경우
            if (!grading.getAnswer().equals(answer)||scoreType.equals(QuizPointType.ZERO)) {
                rankList.add(new GradingResultMessage(MessageType.GRADE, 0, rank, grading.getSender(), grading.getSessionId()));
                continue;
            }
            // 정답이 맞았을 경우
            LocalDateTime time = grading.getSubmissionTime();
            Duration duration = Duration.between(initTime, time);
            score = score - duration.toSeconds() * 8 - rank;
            if(scoreType.equals(QuizPointType.DOUBLE)){
                score = score * 2;
            }else if(scoreType.equals(QuizPointType.TRIPLE)){
                score = score * 3;
            }
            rankList.add(new GradingResultMessage(MessageType.GRADE, score, rank, grading.getSender(), grading.getSessionId()));
            rank++;

            // 최종 점수 데이터 삽입
            redisUtil.setResultData("result_" + pin, new QuizResultMessage(MessageType.END, grading.getSessionId(), grading.getSender(), score, rank));
        }

        // 오답자들 랭크 맞추기
        for (GradingResultMessage g : rankList) {
            if (g.getScore() == 0) {
                g.setRank(rank);
            }
        }
        // 등수 정렬
        Collections.sort(rankList);

        //문제 등수 뿌리기
        MessageGradingResponse responseMessage = new MessageGradingResponse(LocalDateTime.now(), MessageType.GRADE, String.valueOf(pin), rankList, "/play/Answer");
        simpMessagingTemplate.convertAndSend("/sub/pin/" + pin, responseMessage);

    }

    public void chatRoom(int pin, PlayMessageDto message, SimpMessageHeaderAccessor headerAccessor) {
        MessageChatResponse chatMessageResponse = new MessageChatResponse(LocalDateTime.now(), MessageType.CHAT, String.valueOf(pin), message.getSender(), message.getContent(), "/play/joinHost");
        simpMessagingTemplate.convertAndSend("/sub/pin/" + pin, chatMessageResponse);
    }

    public void banUser(int pin, BanMessage message, SimpMessageHeaderAccessor headerAccessor) {

        // 퇴장 레디스 데이터 삭제
        List<UserInfoMessage> userList = redisUtil.deleteUser("user_" + pin, message.getSessionId(), message.getSender());

        // 퇴장 유저
        MessageChatResponse responseMessage = new MessageChatResponse(LocalDateTime.now(), MessageType.BAN, String.valueOf(pin), message.getSender(), "호스트에 의해 퇴장당하셨습니다.", "/play/banUser");
        MessageHeaders headers = createHeaders(message.getSessionId());
        simpMessagingTemplate.convertAndSendToUser(message.getSessionId(), "/sub/message", responseMessage, headers);

        // 퇴장 알림
        responseMessage = new MessageChatResponse(LocalDateTime.now(), MessageType.BAN, String.valueOf(pin), message.getSender(), "호스트가 " + message.getSender() + "님을 내보냈습니다.", "/play/banUser");
        simpMessagingTemplate.convertAndSend("/sub/pin/" + pin, responseMessage);
        headerAccessor.getSessionAttributes().put("pin", pin);

        // 유저 리스트 전송
        String hostSessionId = redisUtil.getKey(String.valueOf(pin));
        MessageHeaders hostHeaders = createHeaders(hostSessionId);
        responseMessage = new MessageChatResponse(LocalDateTime.now(), MessageType.USERLIST, String.valueOf(pin), "", userList, "/play/userList");
        simpMessagingTemplate.convertAndSendToUser(hostSessionId, "/sub/message", responseMessage, hostHeaders);
    }
}
