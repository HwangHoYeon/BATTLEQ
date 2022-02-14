package com.battleq.play.util;

import com.battleq.play.domain.MessageType;
import com.battleq.play.domain.dto.GradingMessage;
import com.battleq.play.domain.dto.QuizResultMessage;
import com.battleq.play.domain.dto.UserInfoMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RedisUtil {

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private StringRedisTemplate playRoomRedisTemplate;

    @Autowired
    private final RedisTemplate<String, GradingMessage> listRedisTemplate;

    @Autowired
    private final RedisTemplate<String, UserInfoMessage> userListRedisTemplate;

    @Autowired
    private final RedisTemplate<String, QuizResultMessage> resultRedisTemplate;


    public boolean hasKey(String key){ return playRoomRedisTemplate.hasKey(key);
    }

    public void setKey(String key, String value) {
        ValueOperations<String, String> valueOperations = playRoomRedisTemplate.opsForValue();
        valueOperations.set(key, value);
        // 만료시간
        /*valueOperations.expire(key, 60, TimeUnit.MINUTES);*/
    }
    public String getKey(String key) {
        return playRoomRedisTemplate.opsForValue().get(key);
    }
    public void deleteKey(String key) {
        playRoomRedisTemplate.delete(key);
    }
    public List<UserInfoMessage> setUser(String key, String sessionId, String sender){
        UserInfoMessage userInfo = new UserInfoMessage().builder().messageType(MessageType.JOIN).sessionId(sessionId).sender(sender).build();
        ListOperations<String, UserInfoMessage> userListOperations = userListRedisTemplate.opsForList();
        userListOperations.rightPush(key, userInfo);
        long size = userListOperations.size(key) == null ? 0 : userListOperations.size(key); // NPE 체크해야함.
        return userListOperations.range(key,0,size);
    }
    public List<UserInfoMessage> deleteUser(String key, String sessionId, String sender){
        UserInfoMessage userInfo = new UserInfoMessage().builder().messageType(MessageType.JOIN).sessionId(sessionId).sender(sender).build();
        ListOperations<String, UserInfoMessage> userListOperations = userListRedisTemplate.opsForList();
        userListOperations.remove(key,1,userInfo);
        long size = userListOperations.size(key) == null ? 0 : userListOperations.size(key); // NPE 체크해야함.
        return userListOperations.range(key,0,size);
    }
    public void setAnswerData(String key, GradingMessage message) {
        ListOperations<String, GradingMessage> listOperations = listRedisTemplate.opsForList();
        listOperations.rightPush(key, message);

        /*
        long size = listOperations.size(key) == null ? 0 : listOperations.size(key); // NPE 체크해야함.
        log.info(String.valueOf(size));
        log.info("operations.opsForList().range() = " + listOperations.range(key, 0, size));
        */
    }
    public boolean findSessionIdWithAnswer(String key, String sessionId){
        ListOperations<String, GradingMessage> listOperations = listRedisTemplate.opsForList();
        long size = listOperations.size(key) == null ? 0 : listOperations.size(key);
        List<GradingMessage> list = listOperations.range(key,0,size);
        for(GradingMessage g : list){
            if(g.getSessionId().equals(sessionId)){
                return false;
            }
        }
        return true;
    }
    public ListOperations<String, GradingMessage> getAnswerData(String key) {
        ListOperations<String, GradingMessage> listOperations = listRedisTemplate.opsForList();
        return listOperations;
    }
    public ListOperations<String, GradingMessage> deleteAnswerData(String key) {
        ListOperations<String, GradingMessage> listOperations = listRedisTemplate.opsForList();
        long size = listOperations.size(key) == null ? 0 : listOperations.size(key);
        for(int i=0;i<size;i++){
            listOperations.leftPop(key);
        }
        return listOperations;
    }

    public void setResultData(String key, QuizResultMessage message) {
        ListOperations<String, QuizResultMessage> listOperations = resultRedisTemplate.opsForList();
        listOperations.rightPush(key, message);
    }
    public ListOperations<String, QuizResultMessage> getResultData(String key) {
        ListOperations<String, QuizResultMessage> listOperations = resultRedisTemplate.opsForList();
        return listOperations;
    }
    public void setDataExpire(String key, String value, long duration) {
        ValueOperations<String, String> valueOperations = playRoomRedisTemplate.opsForValue();
        Duration expireDuration = Duration.ofSeconds(duration);
        valueOperations.set(key, value, expireDuration);
    }

    public void deleteData(String key) {
        playRoomRedisTemplate.delete(key);
    }

    public boolean addZdata(String key, String value, double score) {
        ZSetOperations<String, String> valueOperations = playRoomRedisTemplate.opsForZSet();
        return valueOperations.add(key, value, score);
    }

    public Set<ZSetOperations.TypedTuple<String>> getRanking(String key, long startIndex, long endIndex) {
        ZSetOperations<String, String> valueOpertaions = playRoomRedisTemplate.opsForZSet();
        return valueOpertaions.reverseRangeWithScores(key, startIndex, endIndex);
    }

    // nickname => 세션 아이디?
    public Double getScore(String key, String nickname) {
        ZSetOperations<String, String> valueOperations = playRoomRedisTemplate.opsForZSet();
        return valueOperations.score(key, nickname);
    }

    public Double plusScore(String key, String nickname, double score) {
        ZSetOperations<String, String> valueOperations = playRoomRedisTemplate.opsForZSet();
        return valueOperations.incrementScore(key, nickname, score);
    }

    public Long deleteZdata(String key, long startIndex, long endIndex) {
        ZSetOperations<String, String> valueOperations = playRoomRedisTemplate.opsForZSet();
        return valueOperations.removeRange(key, startIndex, endIndex);
    }

    public Long deleteZdataMember(String key, Object member) {
        ZSetOperations<String, String> valueOperations = playRoomRedisTemplate.opsForZSet();
        return valueOperations.remove(key, member);
    }

    public Long getZCnt(String key) {
        ZSetOperations<String, String> valueOperations = playRoomRedisTemplate.opsForZSet();
        return valueOperations.zCard(key);
    }

}
