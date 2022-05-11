package com.battleq.user.domain.dto.request;

import com.battleq.user.domain.dto.response.MemberResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TokenDto {

    private String token;
    private String message;

    @Builder
    private TokenDto(String token, String message) {
        this.token = token;
        this.message = message;
    }

    public MemberResponse toResponse() {
        return MemberResponse.builder()
                .message(this.message)
                .data(this.token)
                .build();
    }


    public static TokenDto of(String accessToken, String message) {
        return TokenDto.builder()
            .token(accessToken)
            .message(message)
            .build();

    }
}
