package com.battleq.user.service;

import com.battleq.config.aws.AwsS3Uploader;
import com.battleq.config.jwt.JwtTokenProvider;
import com.battleq.user.domain.dto.request.*;
import com.battleq.user.domain.dto.response.FollowerPagingDto;
import com.battleq.user.domain.dto.response.FollowingPagingDto;
import com.battleq.user.domain.entity.Follow;
import com.battleq.user.domain.entity.User;
import com.battleq.user.exception.MemberException;
import com.battleq.user.exception.MemberNotFoundException;
import com.battleq.user.repository.FollowRepository;
import com.battleq.user.repository.UserRepository;
import io.netty.util.internal.StringUtil;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Date;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;
    private final AwsS3Uploader awsS3Uploader;
    private final FollowRepository followRepository;

    /**
     * 회원가입
     */
    public void save(RegistDto dto) {
        String encodePassword = passwordEncoder.encode(dto.getPwd());
        dto.updateEncodePassword(encodePassword);
        userRepository.save(dto.toEntity());
    }

    /**
     * 가입 가능한 email 검증
     */
    public void validateAvailableEmail(String email) {
        findByEmail(email).ifPresent(entity -> {
            throw new IllegalStateException("이미 존재하는 이메일입니다.");
        });
    }

    /**
     * 가입 가능한 nickname 검증
     */
    public void validateAvailableNickName(String nickname) {
        findByNickname(nickname).ifPresent(entity -> {
            throw new IllegalStateException("사용할 수 없는 닉네임입니다.");
        });
    }

    /**
     * 회원 정보 수정
     */
    public void update(MemberDto dto) throws Exception {
        User user = findByEmail(dto.getEmail()).orElseThrow(
            () -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));
        if (StringUtils.hasLength(dto.getPwd())) {
            dto.updateEncodePassword(passwordEncoder.encode(dto.getPwd()));
        }
        user.updateMemberInfo(dto);
        userRepository.save(user);
    }

    /**
     * 로그인
     */
    public TokenDto login(LoginDto dto) throws Exception {
        User user = findByEmail(dto.getEmail())
            .orElseThrow(() -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));
        validatePasswordMatched(dto.getPwd(), user.getPwd());
        String accessToken = jwtTokenProvider.createToken(user.getEmail(), user.getNickname(),
            Arrays.asList(user.getConvertAuthority()));
        return TokenDto.of(accessToken, "로그인 성공");
    }

    /**
     * 유저 상세 보기
     */
    public UserIdDto getMemberDetail(String email) throws Exception {
        User user = findByEmail(email).orElseThrow(
            () -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));
        return UserIdDto.from(user);
    }

    /**
     * 로그아웃
     */
    public void logout(String token) {
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        Date accessTokenExpireDate = jwtTokenProvider.getExpireDate(token);
        valueOperations.set(token, token,
            accessTokenExpireDate.getTime() - System.currentTimeMillis(),
            TimeUnit.MILLISECONDS);
        SecurityContextHolder.clearContext();
    }

    /**
     * 회원삭제
     */
    @Transactional
    public void delete(String email) throws Exception {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));
        user.delete();
    }

    /**
     * 프로필 사진 등록
     */
    public void uploadProfileImage(String email, MultipartFile file) throws Exception {
        User user = findByEmail(email)
            .orElseThrow(() -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));
        try {
            user.updateProfileImage(awsS3Uploader.upload(file, "profile"));
            String profileKey = "profile" + "/" + file.getOriginalFilename();
            if (!StringUtil.isNullOrEmpty(user.getProfileKey())) {
                awsS3Uploader.delete(user.getProfileKey());
            }
            user.updateProfileKey(profileKey);
            userRepository.save(user);
        } catch (Exception e) {
            log.error("프로필 등록 오류");
            e.getStackTrace();
            throw new MemberException("프로필 사진 등록 중 오류가 발생했습니다.");
        }
    }

    /**
     * 팔로우
     */
    public void follow(FollowDto followDto) throws Exception {
        User user = findById(followDto.getUserId());
        User follower = findById(followDto.getFollowerId());
        validateExistFollowed(user, follower);
        Follow entity = Follow.builder()
            .user(user)
            .follower(follower)
            .build();
        followRepository.save(entity);
    }

    /**
     * 언팔로우
     */
    @Transactional
    public void unfollow(FollowDto followDto) throws Exception {
        User user = findById(followDto.getUserId());
        User follower = findById(followDto.getFollowerId());
        Follow follow = findByUserAndFollowerAndDeletedAtIsNull(user, follower)
            .orElseThrow(() -> new IllegalStateException("팔로우 상태가 아닙니다."));
        follow.delete();
    }

    /**
     * 팔로워 조회
     */
    public FollowerPagingDto findFollowers(Long userId, Pageable pageable) throws Exception {
        User user = findById(userId);
        Page<Follow> result = followRepository.findByFollowerAndDeletedAtIsNull(user, pageable);
        return FollowerPagingDto.from(result);
    }

    /**
     * 팔로잉 조회
     */
    public FollowingPagingDto findFollowing(Long userId, Pageable pageable) throws Exception {
        User user = findById(userId);
        Page<Follow> result = followRepository.findByUserAndDeletedAtIsNull(user, pageable);
        return FollowingPagingDto.from(result);
    }

    public boolean isFollowed(Long userId, Long targetId) throws Exception {
        User user = findById(targetId);
        User follower = findById(userId);
        return findByUserAndFollowerAndDeletedAtIsNull(user, follower).isPresent() ? true : false;

    }

    private User findById(Long id) throws Exception {
        return userRepository.findById(id)
            .orElseThrow(() -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));
    }

    private Optional<User> findByNickname(String nickname) {
        return userRepository.findByNickname(nickname);
    }

    private Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    private void validatePasswordMatched(String inputPassword, String originalPassword)
        throws Exception {
        if (!passwordEncoder.matches(inputPassword, originalPassword)) {
            throw new MemberException("비밀번호가 다릅니다.");
        }
    }

    private void validateExistFollowed(User user, User follower) {
        findByUserAndFollowerAndDeletedAtIsNull(user, follower)
            .ifPresent(entity -> {
                throw new IllegalStateException("이미 팔로우되어 있습니다.");
            });
    }

    private Optional<Follow> findByUserAndFollowerAndDeletedAtIsNull(User user, User follower) {
        return followRepository.findByUserAndFollowerAndDeletedAtIsNull(user, follower);
    }
}



