package com.battleq.config.jwt;

import com.battleq.user.service.CustomUserDeatilsService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    /** 토큰 유효시간 */
    private final long TOKEN_VALID_TIME = 60 * 60 * 1000L;

    @Value("${spring.jwt.secret}")
    private String JWT_SECRET_KEY;

    private final CustomUserDeatilsService customUserDeatilsService;
    private final StringRedisTemplate stringRedisTemplate;
    /**
     * TOKEN 생성
     */
    public String createToken(String email, String nickname, Collection<? extends GrantedAuthority> roles) {
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("roles",roles);
        claims.put("nickname",nickname);
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims) //Claims
                .setIssuedAt(now)   //토큰 발행 일자
                .setExpiration(new Date(now.getTime() + TOKEN_VALID_TIME)) // 토큰 만료 시간
                .signWith(SignatureAlgorithm.HS256, JWT_SECRET_KEY) // 암호화 알고리즘, 암호화키
                .compact();
    }


    public Authentication getAuthentication(String token) {
        UserDetails userDetails = customUserDeatilsService.loadUserByUsername(this.getUserEmail(token));
        return new UsernamePasswordAuthenticationToken(userDetails,"", userDetails.getAuthorities());
    }

    public String getUserEmail(String token) {
        return Jwts.parser()
                .setSigningKey(JWT_SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String resolveToken(HttpServletRequest req) {
        return req.getHeader("accessToken");
    }

    public boolean validateToken(String jwtToken) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey(JWT_SECRET_KEY).parseClaimsJws(jwtToken);
            ValueOperations<String,String> logoutValueOperations = stringRedisTemplate.opsForValue();
            if (logoutValueOperations.get(jwtToken) != null) {
                return false;
            }
            return !claims.getBody().getExpiration().before(new Date());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 토큰 만료시간 가져오기
     */
    public Date getExpireDate(String jwtToken) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey(JWT_SECRET_KEY).parseClaimsJws(jwtToken);
            return claims.getBody().getExpiration();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
