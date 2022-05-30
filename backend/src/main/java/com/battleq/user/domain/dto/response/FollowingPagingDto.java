package com.battleq.user.domain.dto.response;

import com.battleq.user.domain.entity.Follow;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

@Getter
@AllArgsConstructor
@Builder
public class FollowingPagingDto {

    private int numberOfElements;
    private Long totalElements;
    private List<FollowDetailDto> data;


    public static FollowingPagingDto from(Page<Follow> result) {
        return FollowingPagingDto.builder()
            .numberOfElements(result.getNumberOfElements())
            .totalElements(result.getTotalElements())
            .data(result.stream().map(follow ->
                FollowDetailDto.builder()
                    .email(follow.getFollower().getEmail())
                    .userName(follow.getFollower().getUserName())
                    .nickname(follow.getFollower().getNickname())
                    .followedAt(follow.getCreatedAt())
                    .build()
            ).collect(Collectors.toList()))
            .build();
    }
}
