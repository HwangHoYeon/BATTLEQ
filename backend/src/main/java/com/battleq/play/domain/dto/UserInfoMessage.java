package com.battleq.play.domain.dto;

import com.battleq.play.domain.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoMessage {
    private MessageType messageType;
    private String sender;
    private String sessionId;
}
