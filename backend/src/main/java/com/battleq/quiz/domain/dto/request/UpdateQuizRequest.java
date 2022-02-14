package com.battleq.quiz.domain.dto.request;

import com.battleq.quiz.domain.dto.QuizDto;
import lombok.Data;

import javax.validation.constraints.NotEmpty;

@Data
public class UpdateQuizRequest{
    private String name;
    private String category;
    private String thumbnail;
    private String introduction;
    private Long memberId;

    public QuizDto toDto(){
        return QuizDto.builder()
                .name(name)
                .category(category)
                .thumbnail(thumbnail)
                .introduction(introduction)
                .memberId(memberId)
                .build();
    }
}
