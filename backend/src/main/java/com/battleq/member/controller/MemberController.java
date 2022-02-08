package com.battleq.member.controller;

import com.battleq.member.domain.dto.request.*;
import com.battleq.member.domain.dto.response.MemberResponse;
import com.battleq.member.exception.MemberException;
import com.battleq.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;

@Slf4j
@RestController
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    /**
     * 회원가입
     */
    @PostMapping("/member")
    public ResponseEntity<MemberResponse> registMember(@RequestBody @Valid RegistDto dto) throws Exception {
        memberService.registMember(dto);
        MemberResponse memberResponse = new MemberResponse("정상 가입되었습니다.", dto.getEmail());
        return new ResponseEntity<MemberResponse>(memberResponse, HttpStatus.CREATED);
    }

    /**
     * 가입 가능한 E-MAIL 확인
     */
    @GetMapping("/member/validate/email/{email}")
    public ResponseEntity validateAvailableEmail(@PathVariable("email") String email) throws Exception {
        boolean isAvailableEmail = memberService.validateAvailableEmail(email);
        if (isAvailableEmail) {
            return new ResponseEntity(HttpStatus.OK); // 200
        } else {
            return new ResponseEntity(HttpStatus.CONFLICT); // 409
        }
    }

    /**
     * 가입 가능한 닉네임 확인
     */
    @GetMapping("/member/validate/nickname/{nickName}")
    public ResponseEntity validateAvailableNickName(@PathVariable("nickName") String nickName) throws Exception {
        boolean isAvailableNickName = memberService.validateAvailableNickName(nickName);
        if (isAvailableNickName) {
            return new ResponseEntity(HttpStatus.OK); // 200
        }
        return new ResponseEntity(HttpStatus.CONFLICT); // 409

    }

    /**
     * 회원정보 수정
     */
    @PutMapping("/member")
    public ResponseEntity<MemberResponse> modifyMemberInfo(@RequestBody @Valid MemberDto dto) throws Exception {
        memberService.modifyMemberInfo(dto);
        MemberResponse memberResponse = new MemberResponse("수정이 완료되었습니다.", dto.getEmail());
        return new ResponseEntity<MemberResponse>(memberResponse, HttpStatus.OK);
    }

    /**
     * 로그인
     */
    @PostMapping("/member/login")
    public ResponseEntity<MemberResponse> doLogin(@RequestBody @Valid LoginDto dto) throws Exception {
        TokenDto tokenDto = memberService.validateLogin(dto);
        MemberResponse memberResponse = tokenDto.toResponse();
        if (memberResponse.getData() != null) {
            return new ResponseEntity<MemberResponse>(memberResponse, HttpStatus.OK);
        }
        return new ResponseEntity<MemberResponse>(memberResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * 유저 상세보기
     */
    @GetMapping("/member/detail/{email}")
    public ResponseEntity<MemberResponse> getMemberDetail(@PathVariable("email") @Valid String email) throws Exception {
        MemberIdDto memberDetail = memberService.getMemberDetail(email);
        MemberResponse memberResponse = new MemberResponse("조회성공", memberDetail);
        return new ResponseEntity<MemberResponse>(memberResponse, HttpStatus.OK);
    }

    /**
     * 로그아웃
     */
    @PostMapping("/member/logout")
    public ResponseEntity<MemberResponse> doLogout(@RequestHeader("accessToken") @Valid String token) throws Exception {
        boolean isLogout = memberService.doLogout(token);
        MemberResponse memberResponse;
        if (isLogout) {
            memberResponse = new MemberResponse("로그아웃 되었습니다.", null);
            return new ResponseEntity<MemberResponse>(memberResponse, HttpStatus.OK);
        }
        memberResponse = new MemberResponse("이미 로그아웃 하셨습니다.", null);
        return new ResponseEntity<MemberResponse>(memberResponse, HttpStatus.BAD_REQUEST);

    }

    /**
     * 회원삭제
     */
    @DeleteMapping("/member/{email}")
    public ResponseEntity deleteMember(@PathVariable("email") @Valid String email) throws Exception {
        memberService.deleteMember(email);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * 프로필 사진 업로드
     */
    @PostMapping("/member/profile")
    public ResponseEntity registProfile(@RequestParam("email") @Valid String email,
                                        @RequestPart("file") @Valid MultipartFile file) throws Exception {
        memberService.uploadProfileImage(email, file);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

}
