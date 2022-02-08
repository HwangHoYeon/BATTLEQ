package com.battleq.room.service;

import com.battleq.member.domain.entity.Member;
import com.battleq.quiz.domain.entity.Quiz;
import com.battleq.quiz.domain.exception.NotFoundQuizException;
import com.battleq.quiz.repository.QuizRepository;
import com.battleq.room.domain.dto.RoomDto;
import com.battleq.room.domain.dto.request.CreateRoomRequest;
import com.battleq.room.domain.entity.Room;
import com.battleq.room.domain.exception.NotFoundPinException;
import com.battleq.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final QuizRepository quizRepository;

    @Transactional
    public int saveRoom(RoomDto roomRequest) throws NotFoundQuizException {

        int pin = generatePinNo();
        Quiz quiz = quizRepository.findById(roomRequest.getQuizId()).orElseThrow(()-> new NotFoundQuizException("검색한 퀴즈의 데이터를 찾을 수 없습니다."));

        Room room = Room.initRoom(roomRequest.getName(),pin,roomRequest.getCapacity(),quiz);
        roomRepository.save(room);
        return pin;
    }


    public Room findByPin(int pin) throws NotFoundPinException {
        return roomRepository.findByPin(pin);
    }
    /*public int roomIsEmpty() {

    }*/

    public static int generatePinNo(){
        return ThreadLocalRandom.current().nextInt(100000,1000000);
    }
}
