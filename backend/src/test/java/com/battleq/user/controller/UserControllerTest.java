package com.battleq.user.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.battleq.user.domain.dto.request.FollowDto;
import com.battleq.user.domain.dto.response.FollowerPagingDto;
import com.battleq.user.domain.dto.response.FollowingPagingDto;
import com.battleq.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.filter.CharacterEncodingFilter;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
public class UserControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WebApplicationContext wac;

    @MockBean
    private UserService userService;

    @BeforeEach
    void setup() {
        this.mvc = MockMvcBuilders.webAppContextSetup(wac)
            .addFilters(new CharacterEncodingFilter("UTF-8", true))  // 필터 추가
            .alwaysDo(print())
            .build();
    }


    @Test
    void 팔로우() throws Exception {
        //given
        FollowDto followDto = FollowDto.builder()
            .userId(1L)
            .followerId(2L)
            .build();

        doNothing().when(userService).follow(followDto);

        String content = objectMapper.writeValueAsString(followDto);

        //when
        mvc.perform(MockMvcRequestBuilders.post("/api/v1/users/follows")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .content(content))
            .andExpect(status().isCreated());
    }

    @Test
    void 언팔로우() throws Exception {
        //given
        FollowDto followDto = FollowDto.builder()
            .userId(1L)
            .followerId(2L)
            .build();

        doNothing().when(userService).unfollow(followDto);

        String content = objectMapper.writeValueAsString(followDto);

        //when
        mvc.perform(MockMvcRequestBuilders.delete("/api/v1/users/follows")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .content(content))
            .andExpect(status().isOk());
    }

    @Test
    void 팔로워_조회() throws Exception {
        //given
        Long userId = 1L;
        when(userService.findFollowers(anyLong(),any())).thenReturn(
            FollowerPagingDto.builder()
                .numberOfElements(0)
                .totalElements(10L)
                .data(List.of())
                .build());
        //when
        mvc.perform(MockMvcRequestBuilders.get("/api/v1/users/" + userId + "/followers")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.numberOfElements").value(0))
            .andExpect(jsonPath("$.totalElements").value(10L));
    }

    @Test
    void 팔로잉_조회() throws Exception {
        //given
        Long userId = 1L;
        when(userService.findFollowing(any(),any())).thenReturn(
            FollowingPagingDto.builder()
                .numberOfElements(0)
                .totalElements(10L)
                .data(List.of())
                .build());
        //when
        mvc.perform(MockMvcRequestBuilders.get("/api/v1/users/" + userId + "/following")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.numberOfElements").value(0))
            .andExpect(jsonPath("$.totalElements").value(10L));
    }

    @Test
    void 해당유저_팔로우를_했을때_true() throws Exception {
        //given
        Long userId = 1L;
        when(userService.isFollowed(anyLong(),anyLong())).thenReturn(true);
        //when
        mvc.perform(MockMvcRequestBuilders.get("/api/v1/users/follows/1?target=2")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(content().string("true"));
    }

    @Test
    void 해당유저_팔로우를_안했을때_false() throws Exception {
        //given
        when(userService.isFollowed(anyLong(),anyLong())).thenReturn(false);
        //when
        mvc.perform(MockMvcRequestBuilders.get("/api/v1/users/follows/1?target=2")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(content().string("false"));
    }
}
