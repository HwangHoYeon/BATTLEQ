package com.battleq.crossword.domain.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;


@Document(indexName = "crossword")
@Setting(settingPath = "/elastic/setting.json")
public class CrossWord {

    @Id
    private String id;
    @Field(type = FieldType.Text, analyzer = "word_analyzer")
    private String question;
    @Field(type = FieldType.Text, analyzer = "word_analyzer")
    private String answer;

    public CrossWord(String question,String answer) {
       this.question = question;
       this.answer = answer;
    }
}
