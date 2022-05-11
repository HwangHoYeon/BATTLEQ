package com.battleq.user.domain.entity;

import com.battleq.common.entity.BaseTimeEntity;
import com.battleq.user.domain.dto.request.MemberDto;
import com.battleq.quiz.domain.entity.Quiz;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "users")
public class User extends BaseTimeEntity {

    @Column(nullable = false, length = 50)
    private String userName;
    @Column(unique = true, length = 500)
    private String email;
    @Column(length = 500)
    private String pwd;
    @Enumerated(EnumType.STRING)
    @Column
    private EmailAuth emailAuth;
    @Column(length = 100, nullable = false)
    private String nickname;
    @Column
    private String profileImg;
    @Column
    private String userInfo;
    @Enumerated(EnumType.STRING)
    @Column
    private Authority authority;
    @Column
    private String profileKey;

    @OneToMany(mappedBy = "follower")
    private List<Follow> followers;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Quiz> quiz;

    public void updateEmailAuth(EmailAuth auth) {
        this.emailAuth = auth;
    }

    @Builder
    private User(String userName, String email, String pwd, EmailAuth emailAuth, String nickname,
        String userInfo, Authority authority) {
        this.userName = userName;
        this.email = email;
        this.pwd = pwd;
        this.emailAuth = emailAuth;
        this.nickname = nickname;
        this.userInfo = userInfo;
        this.authority = authority;
    }

    public void updateMemberInfo(MemberDto dto) {
        this.userName = dto.getUserName();
        this.pwd = dto.getPwd();
        this.nickname = dto.getNickname();
        this.userInfo = dto.getUserInfo();
    }

    public void updateProfileImage(String profileImg) {
        this.profileImg = profileImg;
    }

    public void updateProfileKey(String fileName) {
        this.profileKey = fileName;
    }

    public GrantedAuthority getConvertAuthority() {
        return new SimpleGrantedAuthority(this.authority.toString());
    }

}


