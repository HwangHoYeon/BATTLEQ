package com.battleq.quizItem.domain.dto.request;

import com.battleq.quizItem.domain.QuizPointType;
import com.battleq.quizItem.domain.QuizType;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
public class UpdateQuizItemRequest{
    @NotEmpty
    private String title;
    private List<String> content;
    private String answer;
    private String image;
    private QuizType type;
    private int limitTime;
    private double point;
    private QuizPointType pointType;
    private Long ownerId;

}
