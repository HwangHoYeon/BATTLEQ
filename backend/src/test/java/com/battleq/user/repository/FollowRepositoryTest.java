package com.battleq.user.repository;

import com.battleq.user.domain.entity.Follow;
import com.battleq.user.domain.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import javax.transaction.Transactional;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Transactional
public class FollowRepositoryTest {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    private User initMember(String name, String email, String nickname) {
        return User.builder()
            .userName(name)
            .email(email)
            .pwd("password")
            .nickname(nickname)
            .userInfo("info")
            .build();
    }

    private Follow initFollow(User user, User follower) {
        return Follow.builder()
            .user(user)
            .follower(follower)
            .build();
    }

    @Test
    void 팔로우_등록() {
        //given
        User user = initMember("이름", "이메일1", "닉네임1");
        User follower = initMember("이름2", "이메일2", "닉네임2");

        //when
        Long followId = followRepository.save(initFollow(user, follower)).getId();
        //then
        Optional<Follow> follow = followRepository.findById(followId);
        assertThat(follow.isPresent()).isTrue();
    }

    @Test
    void 팔로우_삭제() {
        //given

        User user = initMember("이름", "이메일1", "닉네임1");
        User follower = initMember("이름2", "이메일2", "닉네임2");
        userRepository.save(user);
        userRepository.save(follower);
        Long followId = followRepository.save(initFollow(user, follower)).getId();

        //when

        Optional<Follow> follow = followRepository.findByUserAndFollowerAndDeletedAtIsNull(
            user,
            follower);
        Follow deleteEntity = follow.get();
        deleteEntity.delete();
        followRepository.save(deleteEntity);

        //then

        Optional<Follow> result = followRepository.findById(followId);
        assertThat(result.isPresent()).isTrue();
        assertThat(result.get().getDeletedAt() != null).isTrue();
    }

    @Test
    void 내가_팔로우한_사람_페이징() {
        //given

        User user = initMember("이름", "이메일1", "닉네임1");
        User follower = initMember("이름2", "이메일2", "닉네임2");
        userRepository.save(user);
        userRepository.save(follower);
        followRepository.save(initFollow(user, follower));

        //when

        Pageable pageable = PageRequest.of(0, 10);
        Page<Follow> follows = followRepository.findByUserAndDeletedAtIsNull(user, pageable);
        //then

        assertThat(follows.getTotalElements()).isEqualTo(1L);
        assertThat(follows.getNumberOfElements()).isEqualTo(1L);
    }

    @Test
    void 나를_팔로우한_사람_페이징() {
        //given

        User user = initMember("이름", "이메일1", "닉네임1");
        User follower = initMember("이름2", "이메일2", "닉네임2");
        userRepository.save(user);
        userRepository.save(follower);
        followRepository.save(initFollow(user, follower));

        //when

        Pageable pageable = PageRequest.of(0, 10);
        Page<Follow> follows = followRepository.findByFollowerAndDeletedAtIsNull(follower,
            pageable);
        //then

        assertThat(follows.getTotalElements()).isEqualTo(1L);
        assertThat(follows.getNumberOfElements()).isEqualTo(1L);
    }

}
