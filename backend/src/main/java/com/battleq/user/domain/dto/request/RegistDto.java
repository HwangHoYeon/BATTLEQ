package com.battleq.user.domain.dto.request;

import com.battleq.user.domain.entity.Authority;
import com.battleq.user.domain.entity.EmailAuth;
import com.battleq.user.domain.entity.User;
import lombok.*;


@Getter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class RegistDto {
    private String userName;
    private String email;
    private String pwd;
    private String nickname;
    private String userInfo;
    private Authority authority;

    public void updateEncodePassword(String password) {
        this.pwd = password;
    }

    public User toEntity() {
        return User.builder()
                .userName(userName)
                .email(email)
                .pwd(pwd)
                .emailAuth(EmailAuth.N)
                .nickname(nickname)
                .userInfo(userInfo)
                .authority(authority)
                .build();
    }
}
