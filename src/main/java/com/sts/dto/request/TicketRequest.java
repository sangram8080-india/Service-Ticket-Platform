package com.sts.dto.request;

import com.sts.enums.TicketStatus;
import com.sts.enums.TicketPriority;

public record TicketRequest(
    String title,
    String description,
    TicketStatus status,
    TicketPriority priority,
    String category,
    String location,
    Long assignedToUserId 
) {}
