package com.battleq.quiz.repository;


import com.battleq.quiz.domain.entity.Quiz;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends CrudRepository<Quiz, Long> {

    public Optional<Quiz> findById(Long id);

    public Slice<Quiz> findAll(Pageable pageable);

    public Slice<Quiz> findByUserId(Long userId, Pageable pageable);

    @Query(value =
        "SELECT q "
            + "FROM Quiz q JOIN q.user m "
            + "WHERE m.nickname = :nickname "
        , countQuery =
        "SELECT COUNT(q) "
            + "FROM Quiz q JOIN q.user m "
            + "WHERE m.nickname = :nickname")
    public Page<Quiz> findByMemberNickname(String nickname, Pageable pageable);

    @Query(value =
        "SELECT q "
            + "FROM Quiz q "
            + "WHERE q.name LIKE %:name% "
        , countQuery =
        "SELECT COUNT(q) "
            + "FROM Quiz q "
            + "WHERE q.name LIKE %:name% ")
    public Page<Quiz> findByName(String name, Pageable pageable);

    @Query(value = "SELECT q "
        + "FROM Quiz q "
        + "WHERE q.category LIKE %:category% ",
        countQuery = "SELECT COUNT(q) "
            + "FROM Quiz q "
            + "WHERE q.category LIKE %:category% ")
    public Page<Quiz> findByCategory(String category, Pageable pageable);

}
