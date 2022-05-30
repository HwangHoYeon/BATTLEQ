package com.battleq.quiz.domain.entity;

import com.battleq.user.domain.entity.User;
import com.battleq.quizItem.domain.entity.QuizItem;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * id : 식별자
 * name : 미션 제목
 * category : 미션 분류
 * thumbnail : 썸네일
 * introduction : 소개
 * quizDate : 생성 시간
 * view : 미션 조회수
 */
@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "quizs")
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_id")
    private Long id;

    @NotEmpty
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Builder.Default
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private List<QuizItem> quizItems = new ArrayList<>();

    private String category;
    private String thumbnail;
    private String introduction;
    @CreatedDate
    private LocalDateTime createdDate;
    @LastModifiedDate
    private LocalDateTime updatedDate;
    private int view;

    /**
     * 초기 퀴즈 셋팅
     */
    public static Quiz initQuiz(String name, String thumbnail, String introduction, String category, User user){
        return Quiz.builder()
                .name(name)
                .thumbnail(thumbnail)
                .introduction(introduction)
                .category(category)
                .user(user)
                .build();
    }

    public void updateQuiz(String name, String category, String thumbnail, String  introduction){
        this.name = name;
        this.category = category;
        this.thumbnail = thumbnail;
        this.introduction = introduction;
    }

}
