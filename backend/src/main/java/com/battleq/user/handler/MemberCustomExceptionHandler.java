package com.battleq.user.handler;

import com.battleq.user.domain.dto.response.MemberResponse;
import com.battleq.user.exception.MemberException;
import com.battleq.user.exception.MemberNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice("com.battleq.user.controller")
public class MemberCustomExceptionHandler {
    @ExceptionHandler({MemberException.class})
    public ResponseEntity<MemberResponse> memberException(MemberException e) {
        return new ResponseEntity<MemberResponse>(new MemberResponse(e.getMessage(),null), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MemberResponse> handledMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error("MethodArgumentNotValidException!!");
        return new ResponseEntity<MemberResponse>(new MemberResponse("비어있는 값을 확인하십시오.",null),HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<MemberResponse> handledMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        log.error("MissingServletRequestParameterException!!");
        return new ResponseEntity<MemberResponse>(new MemberResponse("비어있는 항목을 확인하십시오.",null),HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MemberNotFoundException.class)
    public ResponseEntity<MemberResponse> handledMemberNotFoundException(MemberNotFoundException e) {
        log.error("MemberNotFoundException!!");
        return new ResponseEntity<MemberResponse>(new MemberResponse(e.getMessage(),null),HttpStatus.NO_CONTENT);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<MemberResponse> handledIllegalStateException(IllegalStateException e) {
        log.error("IllegalStateException!!");
        return new ResponseEntity<MemberResponse>(new MemberResponse(e.getMessage(),null),HttpStatus.BAD_REQUEST);
    }
}
