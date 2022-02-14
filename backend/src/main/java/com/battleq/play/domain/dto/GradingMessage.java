package com.battleq.play.domain.dto;

import com.battleq.play.domain.MessageType;
import com.battleq.quizItem.domain.QuizPointType;
import lombok.*;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradingMessage {
    private MessageType messageType;
    private String sessionId;
    private LocalDateTime submissionTime;
    private String sender;
    private String answer;
    private double score;
    private QuizPointType scoreType;
}
