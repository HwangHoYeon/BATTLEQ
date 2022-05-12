package com.battleq.quizItem.domain.dto;

import com.battleq.quizItem.domain.QuizPointType;
import com.battleq.quizItem.domain.QuizType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizItemPlayDto<T> {
    private String title;
    private Object content;
    private String image;
    private QuizType type;
    private int limitTime;
    private double point;
    private QuizPointType pointType;
}
