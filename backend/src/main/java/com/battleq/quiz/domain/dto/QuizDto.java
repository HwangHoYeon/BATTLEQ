package com.battleq.quiz.domain.dto;

import com.battleq.member.domain.entity.Member;
import com.battleq.quiz.domain.dto.request.CreateQuizRequest;
import com.battleq.quiz.domain.entity.Quiz;
import com.battleq.quizItem.domain.dto.QuizItemDto;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDto {
    private Long quizId;
    private String name;
    private String category;
    private String thumbnail;
    private String introduction;
    private Long memberId;
    private List<QuizItemDto> quizItems;

    public QuizDto(Quiz quiz){
        this.quizId = quiz.getId();
        this.name = quiz.getName();
        this.category = quiz.getCategory();
        this.thumbnail = quiz.getThumbnail();
        this.introduction = quiz.getIntroduction();
        this.memberId = quiz.getMember().getId();
        this.quizItems = quiz.getQuizItems().stream().map(quizItem -> new QuizItemDto(quizItem))
                .collect(Collectors.toList());
    }

    public Quiz toEntity(Member member) {
        return Quiz.builder()
                .id(quizId)
                .name(name)
                .member(member)
                .category(category)
                .thumbnail(thumbnail)
                .introduction(introduction)
                .build();
    }
}