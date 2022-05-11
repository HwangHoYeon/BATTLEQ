package com.battleq.user.domain.dto.response;

import lombok.*;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberResponse<T> {

    private String message;
    private T data;

    public static MemberResponse from(String message) {
        return MemberResponse
            .builder()
            .message(message)
            .build();
    }
}
