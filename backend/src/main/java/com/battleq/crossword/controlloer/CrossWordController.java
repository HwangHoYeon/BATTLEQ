package com.battleq.crossword.controlloer;

import com.battleq.crossword.domain.dto.request.CWRequestDto;
import com.battleq.crossword.domain.dto.response.CWResponseDto;
import com.battleq.crossword.service.ElasticSearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;

@RestController
@RequiredArgsConstructor
@Slf4j
public class CrossWordController {
    private final ElasticSearchService elasticSearchService;

    /**
     * 문제 생성
     */
    @PostMapping("/api/v1/crosswords")
    @Transactional
    public ResponseEntity<CWResponseDto> registQuestion(@RequestBody CWRequestDto dto) {
        elasticSearchService.regist(dto);
        return ResponseEntity.ok(CWResponseDto.of());
    }

    /**
     * 문제 가져오기
     */
    @GetMapping("/api/v1/crosswords/{word}")
    public ResponseEntity<CWResponseDto> getQuestion(@PathVariable("word") String word) {
        //여기 예외처리
        return ResponseEntity.ok(CWResponseDto.of(elasticSearchService.get(word)));
    }
}
