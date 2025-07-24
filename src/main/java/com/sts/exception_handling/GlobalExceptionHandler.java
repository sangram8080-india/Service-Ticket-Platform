package com.sts.exception_handling;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
	
	
	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<String> handleDuplicateKey(DataIntegrityViolationException ex) {
	    if (ex.getCause() != null && ex.getCause().getMessage().contains("Duplicate entry")) {
	        return new ResponseEntity<>("Email already exists. Please use a different email.", HttpStatus.BAD_REQUEST);
	    }
	    return new ResponseEntity<>("Data integrity violation", HttpStatus.BAD_REQUEST);
	}
	@ExceptionHandler(EmailAlreadyExistsException.class)
	public ResponseEntity<String> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
	    return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
	}

    
}
