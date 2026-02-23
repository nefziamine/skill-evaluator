package com.skillevaluator.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        // Get the first validation error message
        FieldError firstError = ex.getBindingResult().getFieldErrors().stream().findFirst().orElse(null);
        if (firstError != null) {
            errors.put("error", firstError.getDefaultMessage());
            errors.put("field", firstError.getField());
        } else {
            errors.put("error", "Validation failed");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
