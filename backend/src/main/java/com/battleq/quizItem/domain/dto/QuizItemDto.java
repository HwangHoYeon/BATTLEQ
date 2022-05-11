package com.battleq.quizItem.domain.dto;

import com.battleq.quizItem.domain.QuizPointType;
import com.battleq.quizItem.domain.QuizType;

import com.battleq.quizItem.domain.entity.QuizItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizItemDto<T> {
    private String title;
    private List<String> content;
    private String answer;
    private String image;
    private QuizType type;
    private int limitTime;
    private double point;
    private QuizPointType pointType;
    private Long memberId;
    private Long quizId;

    public QuizItemDto createQuizItemDto(QuizItem quizItem) {
        this.title = quizItem.getTitle();
        this.content = quizItem.getContent();
        this.answer = quizItem.getAnswer();
        this.image = quizItem.getImage();
        this.type = quizItem.getType();
        this.limitTime = quizItem.getLimitTime();
        this.point = quizItem.getPoint();
        this.pointType = quizItem.getPointType();
        this.memberId = quizItem.getUser().getId();
        this.quizId = quizItem.getQuiz().getId();
        return this;
    }

    public QuizItemDto initQuizItemDto(String title, List<String> content, String answer, String image, QuizType type, int limitTime, double point, QuizPointType pointType, Long memberId, Long quizId) {
        QuizItemDto quizItem = QuizItemDto.builder()
                .title(title)
                .content(content)
                .answer(answer)
                .image(image)
                .type(type)
                .limitTime(limitTime)
                .point(point)
                .pointType(pointType)
                .memberId(memberId)
                .quizId(quizId)
                .build();
        return quizItem;
    }

    public QuizItemDto(QuizItem quizItem) {
        this.title = quizItem.getTitle();
        this.content = quizItem.getContent();
        this.answer = quizItem.getAnswer();
        this.image = quizItem.getImage();
        this.type = quizItem.getType();
        this.limitTime = quizItem.getLimitTime();
        this.point = quizItem.getPoint();
        this.pointType = quizItem.getPointType();
        this.memberId = quizItem.getUser().getId();
        this.quizId = quizItem.getQuiz().getId();
    }
}