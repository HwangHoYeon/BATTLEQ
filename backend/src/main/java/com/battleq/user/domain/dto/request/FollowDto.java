package com.battleq.user.domain.dto.request;

import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowDto {
    @NotNull(message = "userId는 필수입니다.")
    private Long userId;
    @NotNull(message = "followerId는 필수입니다.")
    private Long followerId;


}
