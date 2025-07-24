package com.sts.dto.response;

import java.time.LocalDateTime;

public record UserResponce(
		Long id,
	    String email,
	    String name,
	    String phone,
	    String department,
	    String role, 
	    LocalDateTime createdAt,
	    LocalDateTime updatedAt)
{ }
