package com.battleq.quizItem.domain.entity;

import com.battleq.member.domain.entity.Member;
import com.battleq.quiz.domain.entity.Quiz;
import com.battleq.quizItem.domain.QuizPointType;
import com.battleq.quizItem.domain.QuizType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;


import java.util.List;

import static javax.persistence.FetchType.LAZY;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quizItem_id")
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @OneToOne(fetch = LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private String title; //퀴즈 제목
    private String image; //퀴즈 이미지
    private QuizType type; // 퀴즈 타입
    @ElementCollection
    private List<String> content; //퀴즈 문제
    private String answer; //퀴즈 답안
    private int limitTime; // 퀴즈 제한시간
    private double point; // 퀴즈 포인트
    private QuizPointType pointType; // 퀴즈 타입


    public QuizItem(String title, String image, QuizType type, int limitTime, double point, QuizPointType pointType, Member member, Quiz quiz) {
        this.title = title;
        this.limitTime = limitTime;
        this.type = type;
        this.point = point;
        this.pointType = pointType;
        this.image = image;
        this.member = member;
        this.quiz = quiz;
    }

    public static QuizItem createQuizItem(String title, List<String> content, String answer, String image, QuizType type, int limitTime, double point, QuizPointType pointType, Member member, Quiz quiz) {
        QuizItem quizItem = QuizItem.builder()
                .title(title)
                .content(content)
                .answer(answer)
                .image(image)
                .type(type)
                .limitTime(limitTime)
                .point(point)
                .pointType(pointType)
                .member(member)
                .quiz(quiz)
                .build();
        return quizItem;
    }

    public void updateQuizItem(String title, List<String> content, String answer, int limitTime, QuizType type, double point, QuizPointType pointType, String image) {
        this.title = title;
        this.content = content;
        this.answer = answer;
        this.limitTime = limitTime;
        this.type = type;
        this.point = point;
        this.pointType = pointType;
        this.image = image;
    }

}






