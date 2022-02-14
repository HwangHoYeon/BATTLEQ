package com.battleq.quiz.repository;


import com.battleq.quiz.domain.entity.Quiz;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends CrudRepository<Quiz, Long> {

    public Optional<Quiz> findById(Long id);
    public Slice<Quiz> findAll(Pageable pageable);
    public Slice<Quiz> findByMemberId(Long memberId, Pageable pageable);

}
