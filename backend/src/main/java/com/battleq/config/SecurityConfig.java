package com.battleq.config;

import com.battleq.config.jwt.JwtAuthFilter;
import com.battleq.config.jwt.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtTokenProvider jwtTokenProvider;
    private final Environment env;

    public SecurityConfig(JwtTokenProvider jwtTokenProvider, Environment env) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.env = env;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        if (isLocalMode()) {
            setLocalMode(http);
        }
        setCommonConfig(http);
    }

    private boolean isLocalMode() {
        String profile = env.getActiveProfiles().length > 0 ? env.getActiveProfiles()[0] : "";
        return profile.equals("local");
    }

    private void setLocalMode(HttpSecurity http) throws Exception {
        http
            .headers()
            .frameOptions()
            .sameOrigin();

        http
            .authorizeRequests()
            .antMatchers("/h2-console/**").anonymous()
            .antMatchers("/v2/api-docs").anonymous()
            .antMatchers("/swagger-resources/**").anonymous();
    }

    private void setCommonConfig(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().configurationSource(corsConfigurationSource())
            .and()
            .httpBasic().disable();

        http
            .authorizeRequests()
            .antMatchers("/api/v1/users/login").anonymous()
            .antMatchers("/api/v1/users").permitAll()
            .antMatchers("/api/v1/users/validate/**").anonymous()
            .antMatchers("/api/v1/users/profile").hasAnyRole("STUDENT", "TEACHER", "ADMIN")
            .antMatchers("/webjars/**").anonymous()
            .antMatchers("/swagger/**").anonymous()
            .antMatchers("/swagger-ui/**").anonymous()
            .antMatchers("/sub/**").anonymous()
            .antMatchers("/pub/**").anonymous()
            .antMatchers("/connect/**").anonymous()
            .antMatchers("/crossword/**").anonymous()
            .anyRequest().permitAll()
            .and()
            .formLogin().disable()
            .addFilterBefore(new JwtAuthFilter(jwtTokenProvider),
                UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOriginPatterns(Arrays.asList("*"));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        corsConfiguration.setAllowedHeaders(
            Arrays.asList("accessToken", "Cache-Control", "Content-Type"));
        corsConfiguration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;

    }
}