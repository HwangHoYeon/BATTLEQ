package com.battleq.user.domain.dto.response;

import com.battleq.user.domain.entity.Follow;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import org.springframework.data.domain.Page;

@Getter
@AllArgsConstructor
@Builder
public class FollowerPagingDto {

    private int numberOfElements;
    private Long totalElements;
    private List<FollowDetailDto> data;


    public static FollowerPagingDto from(Page<Follow> result) {
        return FollowerPagingDto.builder()
            .numberOfElements(result.getNumberOfElements())
            .totalElements(result.getTotalElements())
            .data(result.stream().map(follow ->
                FollowDetailDto.builder()
                    .email(follow.getUser().getEmail())
                    .userName(follow.getUser().getUserName())
                    .nickname(follow.getUser().getNickname())
                    .followedAt(follow.getCreatedAt())
                    .build()
            ).collect(Collectors.toList()))
            .build();
    }
}
