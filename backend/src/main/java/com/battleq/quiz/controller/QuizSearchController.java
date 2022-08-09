package com.battleq.quiz.controller;

import com.battleq.quiz.domain.dto.QuizDto;
import com.battleq.quiz.domain.dto.response.ExceptionResponse;
import com.battleq.quiz.domain.dto.response.QuizSearchResponse;
import com.battleq.quiz.domain.entity.Quiz;
import com.battleq.quiz.domain.exception.NotFoundQuizException;
import com.battleq.quiz.service.QuizSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class QuizSearchController {
    private final QuizSearchService quizSearchService;

    /**
     * 퀴즈 작성자 닉네임으로 검색
     */
    @GetMapping(value = "/quiz/nick/{nickname}", produces = MediaType.APPLICATION_JSON_VALUE)
    public QuizSearchResponse findQuizWithNickname(@PathVariable("nickname") String nickname,
                                               @RequestParam("offset") int offset, @RequestParam("sort") String sort) throws Exception {
        Page<Quiz> quizPage = quizSearchService.findQuizWithNickname(nickname, offset, sort);
        List<QuizDto> quizContent = quizPage.stream().map(m -> new QuizDto(m)).collect(Collectors.toList());
        int totalCount = quizPage.getTotalPages();

        return new QuizSearchResponse(LocalDateTime.now(), HttpStatus.OK, quizContent, "퀴즈 전체 검색", "api/v1/quiz", totalCount);
    }

    @GetMapping(value = "/quiz/name/{name}")
    public QuizSearchResponse findQuizWithName(@PathVariable("name") String name,
                                           @RequestParam("offset") int offset, @RequestParam("sort") String sort) throws Exception {
        Page<Quiz> quizPage = quizSearchService.findQuizWithName(name, offset, sort);
        List<QuizDto> quizContent = quizPage.stream().map(m -> new QuizDto(m)).collect(Collectors.toList());
        int totalCount = quizPage.getTotalPages();

        return new QuizSearchResponse(LocalDateTime.now(), HttpStatus.OK, quizContent, "퀴즈 전체 검색", "api/v1/quiz", totalCount);
    }

    @GetMapping(value = "/quiz/category/{category}")
    public QuizSearchResponse findQuizWithCategory(@PathVariable("category") String category,
                                               @RequestParam("offset") int offset, @RequestParam("sort") String sort) throws Exception {
        Page<Quiz> quizPage = quizSearchService.findQuizWithCategory(category, offset, sort);
        List<QuizDto> quizContent = quizPage.stream().map(m -> new QuizDto(m)).collect(Collectors.toList());
        int totalCount = quizPage.getTotalPages();

        return new QuizSearchResponse(LocalDateTime.now(), HttpStatus.OK, quizContent, "퀴즈 전체 검색", "api/v1/quiz", totalCount);
    }

    @ExceptionHandler({NotFoundQuizException.class})
    public ResponseEntity<ExceptionResponse> NotFoundQuiz(final Exception ex) {
        return new ResponseEntity<ExceptionResponse>(new ExceptionResponse(LocalDateTime.now(), HttpStatus.NOT_FOUND, "NOT_FOUND", "콘텐츠를 찾을 수 없습니다.", "/api/v1/quiz"), HttpStatus.NO_CONTENT);
    }

}
