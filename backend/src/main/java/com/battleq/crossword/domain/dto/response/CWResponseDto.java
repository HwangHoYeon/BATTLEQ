package com.battleq.crossword.domain.dto.response;

import com.battleq.crossword.domain.entity.CrossWord;
import lombok.*;

import java.util.List;

@Getter
@Builder
public class CWResponseDto {
    private String message;
    private List<CrossWord> data;

    public static CWResponseDto from(List<CrossWord> cwlist)
    {
        return CWResponseDto.builder()
                .message("조회")
                .data(cwlist)
                .build();
    }
    public static CWResponseDto from()
    {
        return CWResponseDto.builder()
                .message("입력")
                .build();
    }
}
