package com.battleq.user.exception;

public class MemberNotFoundException extends Exception{
    public MemberNotFoundException(){

    }
    public MemberNotFoundException(String message) {
        super(message);
    }
}
