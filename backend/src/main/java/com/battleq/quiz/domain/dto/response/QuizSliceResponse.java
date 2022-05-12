package com.battleq.quiz.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class QuizSliceResponse<T> {
    private LocalDateTime timestamp;
    private HttpStatus status;
    private T data;
    private String message;
    private String path;
    private boolean isLast;
}
