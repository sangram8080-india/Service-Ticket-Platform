package com.sts.dto.response;

import java.time.LocalDateTime;

import com.sts.enums.UserRole;

public record UserResponce(
	    Long id,
	    String name,
	    String email,
	    String phone,
	    String department,
	    UserRole role, 
	    LocalDateTime createdAt,
	    LocalDateTime updatedAt
	) {}
