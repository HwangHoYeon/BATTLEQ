package com.battleq.user.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class FollowDetailDto {
    private String email;
    private String userName;
    private String nickname;
    private LocalDateTime followedAt;
}
