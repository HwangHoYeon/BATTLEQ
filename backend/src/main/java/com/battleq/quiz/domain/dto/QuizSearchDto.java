package com.battleq.quiz.domain.dto;

import com.battleq.quiz.domain.entity.Quiz;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuizSearchDto {
    private String name;
    private String category;
    private String thumbnail;
    private String introduction;
    private String writer;


    public QuizSearchDto(Quiz quiz) {
        this.name = quiz.getName();
        this.category = quiz.getCategory();
        this.thumbnail = quiz.getThumbnail();
        this.introduction = quiz.getIntroduction();
        this.writer = quiz.getUser().getNickname();
    }
}
