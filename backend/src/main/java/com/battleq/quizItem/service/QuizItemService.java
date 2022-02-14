package com.battleq.quizItem.service;

import com.battleq.member.domain.entity.Member;
import com.battleq.member.repository.MemberRepository;
import com.battleq.quiz.domain.entity.Quiz;
import com.battleq.quiz.domain.exception.NotFoundMemberException;
import com.battleq.quiz.domain.exception.NotFoundQuizException;
import com.battleq.quiz.repository.QuizRepository;
import com.battleq.quizItem.domain.dto.QuizItemDto;
import com.battleq.quizItem.domain.dto.QuizItemPlayDto;
import com.battleq.quizItem.domain.entity.QuizItem;
import com.battleq.quizItem.domain.exception.NotFoundQuizItemException;
import com.battleq.quizItem.repository.QuizItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class QuizItemService {
    private final QuizItemRepository quizItemRepository;
    private final QuizRepository quizRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public Long saveQuizItem(QuizItemDto quizItemRequest) throws NotFoundMemberException, NotFoundQuizException {

        Member member = foundMember(quizItemRequest.getMemberId());

        Quiz quiz = quizRepository.findById(quizItemRequest.getQuizId()).orElseThrow(()-> new NotFoundQuizException("검색한 퀴즈의 데이터를 찾을 수 없습니다."));;

        foundQuiz(quiz);


        QuizItem quizItem = QuizItem.createQuizItem(quizItemRequest.getTitle(), quizItemRequest.getContent(), quizItemRequest.getAnswer(), quizItemRequest.getImage(), quizItemRequest.getType(), quizItemRequest.getLimitTime(), quizItemRequest.getPoint(), quizItemRequest.getPointType(), member, quiz);

        quizItemRepository.save(quizItem);
        return quizItem.getId();
    }

    @Transactional
    public Long update(Long id, QuizItemDto quizRequest) throws Exception {

        foundMember(quizRequest.getMemberId());

        QuizItem quizItem = quizItemRepository.findOne(id);

        foundQuizItem(id, quizItem);

        quizItem.updateQuizItem(quizRequest.getTitle(), quizRequest.getContent(), quizRequest.getAnswer(), quizRequest.getLimitTime(), quizRequest.getType(), quizRequest.getPoint(), quizRequest.getPointType(), quizRequest.getImage());

        return quizItem.getId();
    }

    public QuizItem findOne(Long quizItemId) {
        return quizItemRepository.findOne(quizItemId);
    }

    public QuizItemPlayDto findOnePlayQuizItem(Long quizItemId) {
        QuizItem quizItem = quizItemRepository.findOne(quizItemId);
        return new QuizItemPlayDto(quizItem.getTitle(), quizItem.getContent(), quizItem.getImage(), quizItem.getType(), quizItem.getLimitTime(), quizItem.getPoint(), quizItem.getPointType());
    }

    public String findOnePlayQuizItemAnswer(Long quizItemId) {
        QuizItem quizItem = quizItemRepository.findOne(quizItemId);
        return quizItem.getAnswer();
    }

    public List<QuizItem> findAllQuizItem(Long quizId) {
        return quizItemRepository.findAll(quizId);
    }

    public Member foundMember(Long id) throws NotFoundMemberException {
        Optional<Member> member = memberRepository.findById(id);
        return member.orElseThrow(() -> new NotFoundMemberException("검색한 사용자의 데이터를 찾을 수 없습니다."));
    }

    public void foundQuiz(Quiz quiz) throws NotFoundQuizException {
        if (quiz == null) {
            throw new NotFoundQuizException("검색한 퀴즈의 데이터를 찾을 수 없습니다.");
        }
    }

    public void foundQuizItem(Long id, QuizItem quizItem) throws NotFoundQuizItemException {
        if (quizItem == null) {
            throw new NotFoundQuizItemException("검색한 퀴즈의 데이터를 찾을 수 없습니다.");
        }
    }

}
