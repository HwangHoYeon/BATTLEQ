package com.battleq.quiz.repository;

import com.battleq.quiz.domain.entity.Quiz;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface QuizSearchRepository extends CrudRepository<Quiz, Long> {
    //@Query("SELECT q FROM Quiz q JOIN fetch q.member m WHERE m.nickname LIKE %:nickname% ")
    @Query(value = "SELECT q FROM Quiz q JOIN fetch q.member m WHERE m.nickname = :nickname ", countQuery = "SELECT count(q) from Quiz q")
    public Page<Quiz> findByMemberNickname(String nickname, Pageable pageable);

    @Query("SELECT q FROM Quiz q WHERE q.name LIKE %:name% ")
    public Page<Quiz> findByName(String name, Pageable pageable);

    @Query("SELECT q FROM Quiz q WHERE q.category LIKE %:category% ")
    public Page<Quiz> findByCategory(String category, Pageable pageable);
}
