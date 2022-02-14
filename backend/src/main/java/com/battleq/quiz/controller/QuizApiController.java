package com.battleq.quiz.controller;

import com.battleq.quiz.domain.dto.QuizDto;
import com.battleq.quiz.domain.dto.request.CreateQuizRequest;
import com.battleq.quiz.domain.dto.request.UpdateQuizRequest;
import com.battleq.quiz.domain.dto.response.*;
import com.battleq.quiz.domain.entity.Quiz;
import com.battleq.quiz.domain.exception.NotAuthorized;
import com.battleq.quiz.domain.exception.NotFoundMemberException;
import com.battleq.quiz.domain.exception.NotFoundQuizException;
import com.battleq.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class QuizApiController {

    private final QuizService quizService;

    @GetMapping("api/v1/quiz")
    public QuizSliceResponse findAllQuizV1(@RequestParam(value = "memberId") Long memberId, @RequestParam(value = "offset", defaultValue = "0") int offset, @RequestParam(value = "sort", defaultValue = "DESC") String sort) throws NotFoundMemberException{

        Slice<Quiz> quizSlice = quizService.findByMemberId(memberId, offset, sort);
        List<QuizDto> quizContent = quizSlice.stream().map(m -> new QuizDto(m)).collect(Collectors.toList());
        boolean isLast = quizSlice.isLast(); //Slice 기법 중 마지막 유무

        return new QuizSliceResponse(LocalDateTime.now(), HttpStatus.OK, quizContent, "퀴즈 전체 검색", "api/v1/quiz", isLast);
    }

    @GetMapping("api/v1/quiz/{quizId}")
    public QuizResponse findOneQuizV1(@PathVariable("quizId") Long quizId) throws NotFoundQuizException {

        QuizDto quizDto = new QuizDto(quizService.findById(quizId));

        return new QuizResponse(LocalDateTime.now(), HttpStatus.OK, quizDto, "퀴즈 단일 검색", "api/v1/quiz");
    }

    @PostMapping("api/v1/quiz")
    public CreateQuizResponse saveQuizV1(@RequestBody @Valid CreateQuizRequest request) throws Exception {

        QuizDto dto = request.toDto();

        Long id = quizService.saveQuiz(dto);

        return new CreateQuizResponse(id);
    }

    @PutMapping("api/v1/quiz/{quizId}")
    public UpdateQuizResponse updateQuizFormV1(@PathVariable("quizId") Long quizId, @RequestBody @Valid UpdateQuizRequest request) throws Exception {

        QuizDto dto = request.toDto();
        quizService.update(quizId, dto);

        Quiz findQuiz = quizService.findById(quizId);

        return new UpdateQuizResponse(findQuiz.getId(), findQuiz.getName());
    }

    @ExceptionHandler({NotFoundMemberException.class})
    public ExceptionResponse NotFoundMember(final Exception ex) {
        return new ExceptionResponse(LocalDateTime.now(), HttpStatus.NOT_FOUND, "NOT_FOUND", "유저 정보가 존재하지 않습니다.", "/api/v1/member");
    }

    @ExceptionHandler({NotFoundQuizException.class})
    public ExceptionResponse NotFoundQuiz(final Exception ex) {
        return new ExceptionResponse(LocalDateTime.now(), HttpStatus.NOT_FOUND, "NOT_FOUND", "퀴즈를 찾을 수 없습니다.", "/api/v1/quiz");
    }

    @ExceptionHandler({NotAuthorized.class})
    public ExceptionResponse NotAuthorizedQuiz(final Exception ex) {
        return new ExceptionResponse(LocalDateTime.now(), HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "권한이 없습니다. ", "/api/v1/quiz");
    }
}
