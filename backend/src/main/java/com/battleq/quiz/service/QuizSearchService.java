package com.battleq.quiz.service;

import com.battleq.quiz.domain.dto.QuizSearchDto;
import com.battleq.quiz.domain.dto.request.QuizSearchRequest;
import com.battleq.quiz.domain.entity.Quiz;
import com.battleq.quiz.domain.exception.NotFoundQuizException;
import com.battleq.quiz.repository.QuizSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizSearchService {

    private final QuizSearchRepository quizSearchRepository;

    /**
     * 이름으로 검색
     */
    public Page<Quiz> findQuizWithNickname(String nickname, int offset, String sort) throws Exception {

        /*List<QuizSearchDto> result = quizSearchRepository.findByMemberNickname(dto.getNickname(),dto.getOffset(),dto.getLimit())
                .stream().map(quiz -> new QuizSearchDto(quiz)).collect(Collectors.toList());*/

        /**
         * 페이징 처리
         */
        int limit = 10; //한 페이지에 보여줄 개수
        PageRequest pageRequest = PageRequest.of(offset,limit,Sort.by(initSort(sort),"updatedDate"));

        return quizSearchRepository.findByMemberNickname(nickname, pageRequest);
    }

    /**
     * 퀴즈 이름으로 검색
     */
    public Page<Quiz> findQuizWithName(String name, int offset, String sort) throws Exception {
        /*int count = quizRepository.countAllQuizWithName(dto.getName()).size();
        if (count == 0) {
            throw new NotFoundQuizException();
        }
        List<QuizSearchDto> result = quizRepository.findAllQuizWithName(dto.getName(),dto.getOffset(),dto.getLimit())
                .stream().map(quiz -> new QuizSearchDto(quiz)).collect(Collectors.toList());
        return new QuizSearchResponse(count,result);*/
        /**
         * 페이징 처리
         */
        int limit = 10; //한 페이지에 보여줄 개수
        PageRequest pageRequest = PageRequest.of(offset,limit,Sort.by(initSort(sort),"updatedDate"));
        return quizSearchRepository.findByName(name, pageRequest);
    }

    /**
     *  카테고리로 검색
     */
    public Page<Quiz> findQuizWithCategory (String category, int offset, String sort) throws Exception {
        /*int count = quizRepository.countAllQuizWithCategory(dto.getCategory()).size();
        if (count == 0) {
            throw new NotFoundQuizException();
        }
        List<QuizSearchDto> result = quizRepository.findAllQuizWithCategory(dto.getCategory(),dto.getOffset(),dto.getLimit())
                .stream().map(quiz -> new QuizSearchDto(quiz)).collect(Collectors.toList());
        return new QuizSearchResponse(count,result);*/
        /**
         * 페이징 처리
         */
        int limit = 10; //한 페이지에 보여줄 개수
        PageRequest pageRequest = PageRequest.of(offset,limit,Sort.by(initSort(sort),"updatedDate"));
        return quizSearchRepository.findByCategory(category,pageRequest);
    }

    public Sort.Direction initSort(String sort){
        if(sort.equals("ASC")) { // 정렬 방식
            return Sort.Direction.ASC;
        }
        return Sort.Direction.DESC;
    }
}
