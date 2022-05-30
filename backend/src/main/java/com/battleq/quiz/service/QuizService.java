package com.battleq.quiz.service;

import com.battleq.user.domain.entity.User;
import com.battleq.user.repository.UserRepository;
import com.battleq.quiz.domain.dto.QuizDto;
import com.battleq.quiz.domain.entity.Quiz;
import com.battleq.quiz.domain.exception.NotAuthorized;
import com.battleq.quiz.domain.exception.NotFoundMemberException;
import com.battleq.quiz.domain.exception.NotFoundQuizException;
import com.battleq.quiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final UserRepository userRepository;

    @Transactional
    public Long saveQuiz(QuizDto quizRequest) throws NotFoundMemberException {

        /**
         * 유저 검증
         */
        User user = foundUser(quizRequest.getMemberId());

        Quiz quiz = Quiz.initQuiz(quizRequest.getName(), quizRequest.getThumbnail(),
            quizRequest.getIntroduction(), quizRequest.getCategory(),
            user);

        quizRepository.save(quiz);
        return quiz.getId();
    }

    @Transactional
    public Long update(Long id, QuizDto quizRequest) throws Exception {

        /**
         * 유저 검증
         */
        foundUser(quizRequest.getMemberId());

        /**
         * 퀴즈 검증
         */
        Quiz quiz = quizRepository.findById(id)
            .orElseThrow(() -> new NotFoundQuizException("검색한 퀴즈의 데이터를 찾을 수 없습니다."));

        /**
         * 권한 검증
         */
        authorizedQuiz(quizRequest.getMemberId(), quiz);

        quiz.updateQuiz(quizRequest.getName(), quizRequest.getCategory(),
            quizRequest.getThumbnail(), quizRequest.getIntroduction());

        return quiz.getId();
    }

    public Quiz findById(Long quizId) throws NotFoundQuizException {

        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new NotFoundQuizException("검색한 퀴즈의 데이터를 찾을 수 없습니다."));

        return quiz;
    }

    public Slice<Quiz> findByUserId(Long memberId, int offset, String sort)
        throws NotFoundMemberException {

        /**
         * 유저 검증
         */
        foundUser(memberId);

        /**
         * 페이징 처리
         */
        int limit = 10; //한 페이지에 보여줄 개수
        Sort.Direction direction = Sort.Direction.DESC; // 정렬 방식
        if (sort.equals("ASC")) {
            direction = Sort.Direction.ASC;
        }
        PageRequest pageRequest = PageRequest.of(offset, limit, Sort.by(direction, "updatedDate"));

        return quizRepository.findByUserId(memberId, pageRequest);
    }

    public User foundUser(Long id) throws NotFoundMemberException {
        return userRepository.findById(id)
            .orElseThrow(() -> new NotFoundMemberException("검색한 사용자의 데이터를 찾을 수 없습니다."));
    }

    public void findQuiz(Quiz quiz) throws NotFoundQuizException {
        if (quiz == null) {
            throw new NotFoundQuizException("검색한 퀴즈의 데이터를 찾을 수 없습니다.");
        }
    }

    public void authorizedQuiz(Long memberId, Quiz quiz) throws NotAuthorized {
        if (quiz.getUser().getId() != memberId) {
            throw new NotAuthorized("사용자에 대한 권한이 없습니다.");
        }
    }

    public Quiz findOnePlayQuiz(Long quizId) throws NotFoundQuizException {
        return quizRepository.findById(quizId)
            .orElseThrow(() -> new NotFoundQuizException("검색한 퀴즈의 데이터를 찾을 수 없습니다."));
    }
}
