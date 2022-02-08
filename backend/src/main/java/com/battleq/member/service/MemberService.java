package com.battleq.member.service;

import com.battleq.config.aws.AwsS3Uploader;
import com.battleq.config.jwt.JwtTokenProvider;
import com.battleq.member.domain.dto.request.*;
import com.battleq.member.domain.dto.response.MemberResponse;
import com.battleq.member.domain.entity.Member;
import com.battleq.member.exception.MemberException;
import com.battleq.member.exception.MemberNotFoundException;
import com.battleq.member.repository.MemberRepository;
import io.netty.util.internal.StringUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Date;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;
    private final AwsS3Uploader awsS3Uploader;

    /**
     * 회원가입
     */
    public void registMember(RegistDto dto) throws Exception {
        try {
            String encodePassword = passwordEncoder.encode(dto.getPwd());
            dto.updateEncodePassword(encodePassword);
            Member member = dto.toEntity();
            memberRepository.save(member);
        } catch (Exception e) {
            e.printStackTrace();
            throw new MemberException("회원가입 도중 오류가 발생했습니다.");
        }
    }

    /**
     * 가입 가능한 email 검증
     */
    public Boolean validateAvailableEmail(String email) throws Exception {
        Optional<Member> member = memberRepository.findMemberByEmail(email);
        if (member.isPresent()) {
            return false;
        }
        return true;
    }

    /**
     * 가입 가능한 nickname 검증
     */
    public boolean validateAvailableNickName(String nickName) throws Exception {
        int nickNameCount = memberRepository.countMemberByNickname(nickName);
        return nickNameCount > 0 ? false : true;
    }

    /**
     * 회원 정보 수정
     */
    public void modifyMemberInfo(MemberDto dto) throws Exception {
        try {
            Member member = memberRepository.findMemberByEmail(dto.getEmail()).orElseThrow(() -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));
            if (dto.getPwd() != null && !dto.getPwd().equals("")) {
                dto.updateEncodePassword(passwordEncoder.encode(dto.getPwd()));
            }

            member.updateMemberInfo(dto);
            memberRepository.save(member);
        } catch (Exception e) {
            throw new MemberException("회원정보 수정 중 오류가 발생했습니다.");
        }
    }

    /**
     * 로그인
     */
    public TokenDto validateLogin(LoginDto dto) throws Exception {
        Member member = memberRepository.findMemberByEmail(dto.getEmail()).orElseThrow(() -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));
        if (!passwordEncoder.matches(dto.getPwd(), member.getPwd())) {
            return new TokenDto(null, "비밀번호가 다릅니다.");
        }
        String accessToken = jwtTokenProvider.createToken(member.getEmail(), member.getNickname(), Arrays.asList(member.getConvertAuthority()));
        return new TokenDto(accessToken, "로그인 성공");
    }

    /**
     * 유저 상세 보기
     */
    public MemberIdDto getMemberDetail(String email) throws Exception {
        Member member = memberRepository.findMemberByEmail(email).orElseThrow(() -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));
        return MemberIdDto.builder()
                .id(member.getId())
                .userName(member.getUserName())
                .email(member.getEmail())
                .nickname(member.getNickname())
                .userInfo(member.getUserInfo())
                .authority(member.getAuthority())
                .profileImg(member.getProfileImg())
                .build();
    }

    /**
     * 로그아웃
     */
    public boolean doLogout(String token) throws Exception {
        try {
            ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
            Date accessTokenExpireDate = jwtTokenProvider.getExpireDate(token);
            valueOperations.set(token, token, accessTokenExpireDate.getTime() - System.currentTimeMillis(), TimeUnit.MILLISECONDS);
            SecurityContextHolder.clearContext();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 회원삭제
     */
    public void deleteMember(String email) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        if (!currentEmail.equals(email)) {
            throw new MemberException("현재 본인 계정이 아닙니다.");
        }
        Member member = memberRepository.findMemberByEmail(email).orElseThrow(() -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));

        try {
            memberRepository.delete(member);
        } catch (Exception e) {
            e.printStackTrace();
            throw new MemberException("삭제 도중 오류가 발생하였습니다.");
        }
    }

    /**
     * 프로필 사진 등록
     */
    public void uploadProfileImage(String email, MultipartFile file) throws Exception {
        Member member = memberRepository.findMemberByEmail(email).orElseThrow(() -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));
        try {
            member.updateProfileImage(awsS3Uploader.upload(file, "profile"));
            String profileKey = "profile" + "/" + file.getOriginalFilename();
            if (!StringUtil.isNullOrEmpty(member.getProfileKey())) {
                awsS3Uploader.delete(member.getProfileKey());
            }
            member.updateProfileKey(profileKey);
            memberRepository.save(member);
        } catch (Exception e) {
            e.printStackTrace();
            throw new MemberException("프로필 사진 등록 중 오류가 발생했습니다.");
        }
    }
}



