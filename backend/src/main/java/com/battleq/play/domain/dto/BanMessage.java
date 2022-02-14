package com.battleq.play.domain.dto;

import com.battleq.play.domain.MessageType;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BanMessage {
    private MessageType messageType;
    private String sessionId;
    private String sender;
}
