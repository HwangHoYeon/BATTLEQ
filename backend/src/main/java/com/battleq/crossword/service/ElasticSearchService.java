package com.battleq.crossword.service;

import com.battleq.crossword.domain.dto.request.CWRequestDto;
import com.battleq.crossword.domain.entity.CrossWord;
import com.battleq.crossword.repository.ElasticSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ElasticSearchService {
    private final ElasticSearchRepository elasticSearchRepository;

    public void regist(CWRequestDto dto) {
        CrossWord crossWord = new CrossWord(dto.getQuestion(),dto.getAnswer());
        elasticSearchRepository.save(crossWord);
    }

    public List<CrossWord> get(String word) {
        List<CrossWord> cwList =elasticSearchRepository.findAllByQuestion(word);
        return cwList;
    }

    public List<CrossWord> get(int len) {

        return null;
    }
}
