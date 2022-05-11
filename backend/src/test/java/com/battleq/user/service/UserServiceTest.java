package com.battleq.user.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.battleq.user.domain.dto.request.FollowDto;
import com.battleq.user.domain.dto.response.FollowerPagingDto;
import com.battleq.user.domain.dto.response.FollowingPagingDto;
import com.battleq.user.domain.entity.Authority;
import com.battleq.user.domain.entity.EmailAuth;
import com.battleq.user.domain.entity.Follow;
import com.battleq.user.domain.entity.User;
import com.battleq.user.repository.FollowRepository;
import com.battleq.user.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FollowRepository followRepository;

    private User initMember(String userName, String email, String nickname, Long id) {
        User user = User.builder()
            .userName(userName)
            .email(email)
            .pwd("pwd")
            .emailAuth(EmailAuth.N).nickname(nickname).userInfo("userinfo")
            .authority(Authority.ROLE_STUDENT)
            .build();

        ReflectionTestUtils.setField(user, "id", id);
        return user;
    }

    private Follow initFollow(User user, User follower, Long id) {
        Follow follow = Follow.builder()
            .user(user)
            .follower(follower)
            .build();
        ReflectionTestUtils.setField(follow, "id", id);
        return follow;
    }

    private void addFollower(User user, Follow follow) {
        ReflectionTestUtils.setField(user, "followers", new ArrayList(List.of(follow)));
    }

    @Test
    void 팔로우() throws Exception {
        //given
        when(userRepository.findById(1L)).thenReturn(
            Optional.of(initMember("유저", "email1", "nick1", 1L)));

        when(userRepository.findById(2L)).thenReturn(
            Optional.of(initMember("팔로워", "email2", "nick2", 2L)));

        //when
        userService.follow(FollowDto
            .builder()
            .userId(1L)
            .followerId(2L)
            .build());

        //then
        verify(followRepository, times(1)).save(any());
    }

    @Test
    void 팔로워_조회() throws Exception {
        //given
        User user = initMember("유저", "email1", "nick1", 1L);
        User follower = initMember("팔로워", "email2", "nick2", 2L);
        Follow follow = initFollow(user, follower, 1L);
        addFollower(user, follow);

        List<Follow> follows = new ArrayList<>();
        follows.add(follow);

        when(userRepository.findById(2L)).thenReturn(
            Optional.of(follower));

        when(followRepository.findByFollowerAndDeletedAtIsNull(any(),
            any())).thenReturn(new PageImpl<>(follows));
        //when
        FollowerPagingDto result = userService.findFollowers(2L, any());

        //then
        assertThat(result.getNumberOfElements()).isEqualTo(1L);
        assertThat(result.getTotalElements()).isEqualTo(1L);
        assertThat(result.getData().size()).isEqualTo(1);
    }

    @Test
    void 팔로잉_조회() throws Exception {
        //given
        User user = initMember("유저", "email1", "nick1", 1L);
        User follower = initMember("팔로워", "email2", "nick2", 2L);
        Follow follow = initFollow(user, follower, 1L);
        addFollower(user, follow);

        List<Follow> follows = new ArrayList<>();
        follows.add(follow);

        when(userRepository.findById(1L)).thenReturn(
            Optional.of(follower));

        when(followRepository.findByUserAndDeletedAtIsNull(any(),
            any())).thenReturn(new PageImpl<>(follows));
        //when
        FollowingPagingDto result = userService.findFollowing(1L, any());

        //then
        assertThat(result.getNumberOfElements()).isEqualTo(1L);
        assertThat(result.getTotalElements()).isEqualTo(1L);
        assertThat(result.getData().size()).isEqualTo(1);
    }

    @Test
    void 해당_유저를_팔로우했을때_true를_반환한다() throws Exception {
        //given
        User user = initMember("유저", "email1", "nick1", 1L);
        User follower = initMember("팔로워", "email2", "nick2", 2L);
        Follow follow = initFollow(user, follower, 1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.findById(2L)).thenReturn(Optional.of(follower));
        when(followRepository.findByUserAndFollowerAndDeletedAtIsNull(any(), any())).thenReturn(
            Optional.of(follow));

        //when
        boolean result = userService.isFollowed(1L, 2L);

        //then
        assertThat(result).isTrue();
    }

    @Test
    void 해당_유저를_팔로우하지_않았을때_false를_반환한다() throws Exception {
        //given
        User user = initMember("유저", "email1", "nick1", 1L);
        User follower = initMember("팔로워", "email2", "nick2", 2L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.findById(2L)).thenReturn(Optional.of(follower));
        when(followRepository.findByUserAndFollowerAndDeletedAtIsNull(any(), any())).thenReturn(
            Optional.empty());

        //when
        boolean result = userService.isFollowed(1L, 2L);

        //then
        assertThat(result).isFalse();
    }
}
