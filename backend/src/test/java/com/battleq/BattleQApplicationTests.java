package com.battleq;

import com.battleq.crossword.controlloer.CrossWordController;
import com.battleq.crossword.domain.dto.request.CWRequestDto;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BattleQApplicationTests {

    CrossWordController controller;

    @Test
    void test() throws Exception {
        System.out.println("??");
        CWRequestDto cwRequestDto = new CWRequestDto("문제1","답1");

        controller.registQuestion(cwRequestDto);
    }

}
