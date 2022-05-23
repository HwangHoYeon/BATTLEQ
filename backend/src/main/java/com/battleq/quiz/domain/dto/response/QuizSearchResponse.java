package com.battleq.quiz.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class QuizSearchResponse<T> {
    private LocalDateTime timestamp;
    private HttpStatus status;
    private T data;
    private String message;
    private String path;
    private int totalCount;
}
