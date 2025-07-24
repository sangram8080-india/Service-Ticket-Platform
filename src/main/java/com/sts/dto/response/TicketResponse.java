package com.sts.dto.response;

import java.time.LocalDateTime;

import com.sts.enums.TicketStatus;

public record TicketResponse(
    Long id,
    String title,
    String description,
    TicketStatus status,
    LocalDateTime createdAt,
    Long assignedToUserId,
    String assignedToUserName
) {}
