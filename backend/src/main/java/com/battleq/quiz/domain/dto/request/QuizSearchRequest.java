package com.battleq.quiz.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuizSearchRequest {
    private String order;
    private int limit;
    private int offset;
}
