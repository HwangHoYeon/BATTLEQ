package com.battleq.user.controller;

import com.battleq.user.domain.dto.request.FollowDto;
import com.battleq.user.domain.dto.request.LoginDto;
import com.battleq.user.domain.dto.request.MemberDto;
import com.battleq.user.domain.dto.request.RegistDto;
import com.battleq.user.domain.dto.request.UserIdDto;
import com.battleq.user.domain.dto.response.MemberResponse;
import com.battleq.user.service.UserService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 회원가입
     */
    @PostMapping("/api/v1/users")
    public ResponseEntity<MemberResponse> save(@RequestBody @Valid RegistDto dto)
        throws Exception {
        userService.save(dto);
        return new ResponseEntity<MemberResponse>(new MemberResponse("정상 가입되었습니다.", dto.getEmail()),
            HttpStatus.CREATED);
    }

    /**
     * 가입 가능한 E-MAIL 확인
     */
    @GetMapping("/api/v1/users/validate/email/{email}")
    public ResponseEntity validateEmail(@PathVariable("email") String email)
        throws Exception {
        userService.validateAvailableEmail(email);
        return new ResponseEntity(HttpStatus.OK); // 200
    }

    /**
     * 가입 가능한 닉네임 확인
     */
    @GetMapping("/api/v1/users/validate/nickname/{nickName}")
    public ResponseEntity validateNickname(@PathVariable("nickName") String nickName)
        throws Exception {
        userService.validateAvailableNickName(nickName);
        return new ResponseEntity(HttpStatus.OK); // 200
    }

    /**
     * 회원정보 수정
     */
    @PutMapping("/api/v1/users")
    public ResponseEntity<MemberResponse> update(@RequestBody @Valid MemberDto dto)
        throws Exception {
        userService.update(dto);
        MemberResponse memberResponse = new MemberResponse("수정이 완료되었습니다.", dto.getEmail());
        return new ResponseEntity<MemberResponse>(memberResponse, HttpStatus.OK);
    }

    /**
     * 로그인
     */
    @PostMapping("/api/v1/users/login")
    public ResponseEntity<MemberResponse> login(@RequestBody @Valid LoginDto dto)
        throws Exception {
        return new ResponseEntity<MemberResponse>(userService.login(dto).toResponse(),
            HttpStatus.OK);
    }

    /**
     * 유저 상세보기
     */
    @GetMapping("/api/v1/users/{email}")
    public ResponseEntity<MemberResponse> detail(
        @PathVariable("email") @Valid String email) throws Exception {
        UserIdDto memberDetail = userService.getMemberDetail(email);
        MemberResponse memberResponse = new MemberResponse("조회성공", memberDetail);
        return new ResponseEntity<MemberResponse>(memberResponse, HttpStatus.OK);
    }

    /**
     * 로그아웃
     */
    @PostMapping("/api/v1/users/logout")
    public ResponseEntity<MemberResponse> logout(
        @RequestHeader("accessToken") @Valid String token) throws Exception {
        userService.logout(token);
        return new ResponseEntity<MemberResponse>(MemberResponse.from("로그아웃 되었습니다."),
            HttpStatus.OK);
    }

    /**
     * 회원삭제
     */
    @DeleteMapping("/api/v1/users/{email}")
    public ResponseEntity deleteMember(@PathVariable("email") @Valid String email)
        throws Exception {
        userService.delete(email);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * 프로필 사진 업로드
     */
    @PostMapping("/api/v1/users/profile")
    public ResponseEntity saveProfile(@RequestParam("email") @Valid String email,
        @RequestPart("file") @Valid MultipartFile file) throws Exception {
        userService.uploadProfileImage(email, file);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    /**
     * 팔로우
     */
    @PostMapping("/api/v1/users/follows")
    public ResponseEntity<?> follow(@RequestBody @Valid FollowDto followDto) throws Exception {
        userService.follow(followDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    /**
     * 언팔로우
     */
    @DeleteMapping("/api/v1/users/follows")
    public ResponseEntity<?> unfollow(@RequestBody @Valid FollowDto followDto) throws Exception {
        userService.unfollow(followDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * 팔로워 조회
     */
    @GetMapping("/api/v1/users/{userId}/followers")
    public ResponseEntity<?> followers(@PathVariable Long userId, Pageable pageable)
        throws Exception {
        return ResponseEntity.ok(userService.findFollowers(userId, pageable));
    }

    /**
     * 팔로잉 조회
     */
    @GetMapping("/api/v1/users/{userId}/following")
    public ResponseEntity<?> following(@PathVariable Long userId, Pageable pageable)
        throws Exception {
        return ResponseEntity.ok(userService.findFollowing(userId, pageable));
    }

    /**
     * 해당 유저를 팔로우 하고 있는지 확인한다.
     */
    @GetMapping("/api/v1/users/follows/{userId}")
    public ResponseEntity<?> followCheck(@PathVariable Long userId,
        @RequestParam(name = "target") Long targetUserId)
        throws Exception {
        return ResponseEntity.ok(userService.isFollowed(userId, targetUserId));
    }

}
