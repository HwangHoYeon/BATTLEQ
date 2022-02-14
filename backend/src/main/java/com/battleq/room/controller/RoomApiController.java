package com.battleq.room.controller;


import com.battleq.quiz.domain.dto.response.ExceptionResponse;
import com.battleq.quiz.domain.exception.NotFoundQuizException;
import com.battleq.room.domain.dto.RoomDto;
import com.battleq.room.domain.dto.request.CreateRoomRequest;
import com.battleq.room.domain.dto.response.CreateRoomResponse;
import com.battleq.room.domain.dto.response.RoomResponse;
import com.battleq.room.domain.exception.NotFoundPinException;
import com.battleq.room.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class RoomApiController {

    private final RoomService roomService;

    @GetMapping("api/v1/room/{pin}")
    public RoomResponse findOneRoomV1(@PathVariable("pin") int pin) throws Exception {
        RoomDto roomDto = new RoomDto(roomService.findByPin(pin));

        return new RoomResponse(LocalDateTime.now(), HttpStatus.OK, roomDto ,"방 검색", "api/v1/room");

    }
    @PostMapping("api/v1/room")
    public CreateRoomResponse saveRoomV1(@RequestBody @Valid CreateRoomRequest request) throws Exception {

        RoomDto dto = RoomDto.builder()
                .name(request.getName())
                .capacity(request.getCapacity())
                .quizId(request.getQuizId()).build();
        int pin = roomService.saveRoom(dto);

        return new CreateRoomResponse(pin);
    }

    @ExceptionHandler({NotFoundPinException.class})
    public ExceptionResponse NotFoundRoom(final Exception ex){
        return new ExceptionResponse(LocalDateTime.now(), HttpStatus.NOT_FOUND, "NOT_FOUND", "참가하려는 방이 존재하지 않습니다.", "/api/v1/room");
    }
    @ExceptionHandler({NotFoundQuizException.class})
    public ExceptionResponse NotFoundQuiz(final Exception ex) {
        return new ExceptionResponse(LocalDateTime.now(), HttpStatus.NOT_FOUND, "NOT_FOUND", "콘텐츠를 찾을 수 없습니다.", "/api/v1/quiz");
    }
}
