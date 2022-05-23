package com.battleq.member.domain.dto.request;

import com.battleq.member.domain.entity.Authority;
import com.battleq.member.domain.entity.EmailAuth;
import lombok.*;

@Getter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class MemberIdDto {
    private Long id;
    private String userName;
    private String email;
    private String pwd;
    private EmailAuth emailAuth;
    private String nickname;
    private String userInfo;
    private String profileImg;
    private Authority authority;
}
