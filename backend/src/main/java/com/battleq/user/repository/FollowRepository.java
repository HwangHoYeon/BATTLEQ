package com.battleq.user.repository;

import com.battleq.user.domain.entity.Follow;
import com.battleq.user.domain.entity.User;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    Optional<Follow> findByUserAndFollowerAndDeletedAtIsNull(User user, User Follower);

    Page<Follow> findByUserAndDeletedAtIsNull(User user, Pageable pageable);

    Page<Follow> findByFollowerAndDeletedAtIsNull(User follower, Pageable pageable);
}
