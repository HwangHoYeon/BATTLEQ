package com.battleq.crossword.repository;

import com.battleq.crossword.domain.entity.CrossWord;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface ElasticSearchRepository extends ElasticsearchRepository<CrossWord,Long>  {
    List<CrossWord> findAllByQuestion (String word);

}
