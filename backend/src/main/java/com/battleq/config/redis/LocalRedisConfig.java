package com.battleq.config.redis;

import com.battleq.play.domain.dto.GradingMessage;
import com.battleq.play.domain.dto.QuizResultMessage;
import com.battleq.play.domain.dto.UserInfoMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.*;
import redis.embedded.RedisServer;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Profile("local")
@Configuration
public class LocalRedisConfig {
    @Value("${spring.redis.port}")
    private int redisPort;

    private RedisServer redisServer;

    @PostConstruct
    public void redisServer() throws Exception {
        if (isArmMac()) {
            redisServer = new RedisServer(getRedisFileForArmMac(),redisPort);
        } else {
            redisServer = RedisServer.builder()
                    .port(redisPort)
                    //.redisExecProvider(customRedisExec)
                    .setting("maxmemory 128M") //maxheap 128M
                    .build();
        }

        redisServer.start();
    }

    @PreDestroy
    public void stopRedis() throws Exception {
        if (redisServer != null) {
            redisServer.stop();
        }
    }
    private boolean isArmMac() throws Exception {
        return System.getProperty("os.arch").equals("aarch64") &&
                System.getProperty("os.name").equals("Mac OS X");
    }

    private File getRedisFileForArmMac() throws IOException{
        File file = new ClassPathResource("redis/redis-server-m1-mac").getFile();
        return file;
    }
    @Bean public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS); // timestamp 형식 안따르도록 설정
        mapper.registerModules(new JavaTimeModule(), new Jdk8Module()); // LocalDateTime 매핑을 위해 모듈 활성화
        return mapper;
    }
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory();  // Lettuce 사용
    }

    @Bean
    public RedisTemplate<String, GradingMessage> gradingRedisTemplate() {
        var serializer = new Jackson2JsonRedisSerializer<>(GradingMessage.class);
        serializer.setObjectMapper(objectMapper());

        RedisTemplate<String, GradingMessage> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        // value serializer
        redisTemplate.setKeySerializer(new StringRedisSerializer());   // Key: String
        redisTemplate.setValueSerializer(serializer);  // Value: 직렬화에 사용할 Object 사용하기
        // hash value serializer
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new GenericJackson2JsonRedisSerializer(objectMapper()));
        return redisTemplate;
    }

    @Bean
    public RedisTemplate<String, UserInfoMessage> userRedisTemplate() {
        var serializer = new Jackson2JsonRedisSerializer<>(UserInfoMessage.class);
        serializer.setObjectMapper(objectMapper());

        RedisTemplate<String, UserInfoMessage> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        // value serializer
        redisTemplate.setKeySerializer(new StringRedisSerializer());   // Key: String
        redisTemplate.setValueSerializer(serializer);  // Value: 직렬화에 사용할 Object 사용하기
        // hash value serializer
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new GenericJackson2JsonRedisSerializer(objectMapper()));
        return redisTemplate;
    }
    @Bean
    public RedisTemplate<String, QuizResultMessage> resultRedisTemplate() {
        var serializer = new Jackson2JsonRedisSerializer<>(QuizResultMessage.class);
        serializer.setObjectMapper(objectMapper());

        RedisTemplate<String, QuizResultMessage> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        // value serializer
        redisTemplate.setKeySerializer(new StringRedisSerializer());   // Key: String
        redisTemplate.setValueSerializer(serializer);  // Value: 직렬화에 사용할 Object 사용하기
        // hash value serializer
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new GenericJackson2JsonRedisSerializer(objectMapper()));
        return redisTemplate;
    }
}
