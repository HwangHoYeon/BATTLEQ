package com.battleq.user.domain.dto.request;

import com.battleq.user.domain.entity.Authority;
import com.battleq.user.domain.entity.EmailAuth;
import lombok.*;

@Getter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class MemberDto {

    private String userName;
    private String email;
    private String pwd;
    private EmailAuth emailAuth;
    private String nickname;
    private String userInfo;
    private String profileImg;
    private Authority authority;

    public void updateEncodePassword(String password) {
        this.pwd = password;
    }
}
