package com.battleq.user.domain.dto.request;

import com.battleq.user.domain.entity.Authority;
import com.battleq.user.domain.entity.EmailAuth;
import com.battleq.user.domain.entity.User;
import lombok.*;

@Getter
@ToString
public class UserIdDto {
    private Long id;
    private String userName;
    private String email;
    private String pwd;
    private EmailAuth emailAuth;
    private String nickname;
    private String userInfo;
    private String profileImg;
    private Authority authority;

    @Builder
    private UserIdDto(Long id, String userName, String email, String pwd,
        EmailAuth emailAuth, String nickname, String userInfo, String profileImg,
        Authority authority) {
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.pwd = pwd;
        this.emailAuth = emailAuth;
        this.nickname = nickname;
        this.userInfo = userInfo;
        this.profileImg = profileImg;
        this.authority = authority;
    }

    public static UserIdDto from(User user) {
        return UserIdDto.builder()
            .id(user.getId())
            .userName(user.getUserName())
            .email(user.getEmail())
            .nickname(user.getNickname())
            .userInfo(user.getUserInfo())
            .authority(user.getAuthority())
            .profileImg(user.getProfileImg())
            .build();
    }
}
