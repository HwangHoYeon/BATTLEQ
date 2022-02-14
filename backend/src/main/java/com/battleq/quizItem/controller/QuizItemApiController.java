package com.battleq.quizItem.controller;

import com.battleq.quiz.domain.dto.response.ExceptionResponse;
import com.battleq.quiz.domain.exception.NotAuthorized;
import com.battleq.quiz.domain.exception.NotFoundMemberException;
import com.battleq.quiz.domain.exception.NotFoundQuizException;
import com.battleq.quizItem.domain.dto.QuizItemDto;
import com.battleq.quizItem.domain.dto.request.CreateQuizItemRequest;
import com.battleq.quizItem.domain.dto.request.UpdateQuizItemRequest;
import com.battleq.quizItem.domain.dto.response.CreateQuizItemResponse;
import com.battleq.quizItem.domain.dto.response.QuizItemListResponse;
import com.battleq.quizItem.domain.dto.response.QuizItemResponse;
import com.battleq.quizItem.domain.dto.response.UpdateQuizItemResponse;
import com.battleq.quizItem.domain.entity.QuizItem;
import com.battleq.quizItem.domain.exception.NotFoundQuizItemException;
import com.battleq.quizItem.service.QuizItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class QuizItemApiController {
    private final QuizItemService quizItemService;

    @GetMapping("api/v1/quizItem/quiz/{quizId}")
    public QuizItemListResponse findAllQuizItemV1(@PathVariable("quizId") Long quizId) {
        List<QuizItemDto> resultQuizItems = quizItemService.findAllQuizItem(quizId).stream()
                .map(m -> new QuizItemDto().createQuizItemDto(m))
                .collect(Collectors.toList());

        return new QuizItemListResponse("status OK", resultQuizItems, "퀴즈 아이템 전체 검색");
    }

    @GetMapping("api/v1/quizItem/{quizItemId}")
    public QuizItemResponse findOneQuizItemV1(@PathVariable("quizItemId") Long quizItemId) {
        QuizItemDto quizItemDto = new QuizItemDto().createQuizItemDto(quizItemService.findOne(quizItemId));

        return new QuizItemResponse("status OK", quizItemDto, "퀴즈 아이템 단일 검색");
    }

    @PostMapping("api/v1/quizItem")
    public CreateQuizItemResponse saveQuizItemV1(@RequestBody @Valid CreateQuizItemRequest request) throws Exception {

        QuizItemDto dto = new QuizItemDto().initQuizItemDto(request.getTitle(), request.getContent(), request.getAnswer(), request.getImage(), request.getType(), request.getLimitTime(), request.getPoint(), request.getPointType(), request.getOwnerId(), request.getQuizId());

        Long id = quizItemService.saveQuizItem(dto);
        return new CreateQuizItemResponse(id);
    }

    @PutMapping("api/v1/quizItem/{quizItemId}")
    public UpdateQuizItemResponse updateQuizItemFormV1(@PathVariable("quizItemId") Long quizItemId, @RequestBody @Valid UpdateQuizItemRequest request) throws Exception {

        QuizItemDto dto = new QuizItemDto().initQuizItemDto(request.getTitle(), request.getContent(), request.getAnswer(), request.getImage(), request.getType(), request.getLimitTime(), request.getPoint(), request.getPointType(), request.getOwnerId(), quizItemId);

        quizItemService.update(quizItemId, dto);
        QuizItem findQuizItem = quizItemService.findOne(quizItemId);
        return new UpdateQuizItemResponse(findQuizItem.getId(), findQuizItem.getTitle());
    }

    @ExceptionHandler({NotFoundMemberException.class})
    public ExceptionResponse NotFoundMember(final Exception e) {
        return new ExceptionResponse(LocalDateTime.now(), HttpStatus.NOT_FOUND, "NOT_FOUND", "유저 정보가 존재하지 않습니다.", "/api/v1/member");
    }

    @ExceptionHandler({NotFoundQuizItemException.class})
    public ExceptionResponse NotFoundQuizItem(final Exception e) {
        return new ExceptionResponse(LocalDateTime.now(), HttpStatus.NOT_FOUND, "NOT_FOUND", "콘텐츠를 찾을 수 없습니다.", "/api/v1/quizItem");
    }

    @ExceptionHandler({NotFoundQuizException.class})
    public ExceptionResponse NotFoundQuiz(final Exception e) {
        return new ExceptionResponse(LocalDateTime.now(), HttpStatus.NOT_FOUND, "NOT_FOUND", "콘텐츠를 찾을 수 없습니다.", "/api/v1/quiz");
    }

    @ExceptionHandler({NotAuthorized.class})
    public ExceptionResponse NotAuthorizedQuiz(final Exception e) {
        return new ExceptionResponse(LocalDateTime.now(), HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "권한이 없습니다. ", "/api/v1/quizItem");
    }

}
