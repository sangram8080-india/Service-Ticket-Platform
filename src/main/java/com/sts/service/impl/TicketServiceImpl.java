package com.sts.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sts.dto.request.TicketRequest;
import com.sts.dto.response.TicketResponse;
import com.sts.entity.Ticket;
import com.sts.entity.User;
import com.sts.repository.TicketRepository;
import com.sts.repository.UserRepository;
import com.sts.service.TicketService;

@Service
public class TicketServiceImpl implements TicketService {

	@Autowired
	private TicketRepository ticketRepository;

	@Autowired
	private UserRepository userRepository;

	@Override
	public TicketResponse createTicket(TicketRequest request) {
		Ticket ticket = new Ticket();

		ticket.setTitle(request.title());
		ticket.setDescription(request.description());
		ticket.setStatus(request.status());
		ticket.setPriority(request.priority());
		ticket.setCategory(request.category());
		ticket.setLocation(request.location());

		if (request.assignedToUserId() != null) {
			User assignedUser = userRepository.findById(request.assignedToUserId()).orElseThrow(
					() -> new RuntimeException("Assigned user not found with ID: " + request.assignedToUserId()));
			ticket.setAssignedTo(assignedUser);
		}

		String generatedTicketNumber = "TICKET-" + System.currentTimeMillis();
		ticket.setTicketNumber(generatedTicketNumber);

		Ticket savedTicket = ticketRepository.save(ticket);

		return new TicketResponse(savedTicket.getId(), savedTicket.getTitle(), savedTicket.getDescription(),
				savedTicket.getStatus(), savedTicket.getCreatedAt(),
				savedTicket.getAssignedTo() != null ? savedTicket.getAssignedTo().getId() : null,
				savedTicket.getAssignedTo() != null ? savedTicket.getAssignedTo().getName() : null);
	}

	@Override
	public List<TicketResponse> getAllTickets() {
	    return ticketRepository.findAll().stream()
	        .map(ticket -> new TicketResponse(
	            ticket.getId(),
	            ticket.getTitle(),
	            ticket.getDescription(),
	            ticket.getStatus(),
	            ticket.getCreatedAt(),
	            ticket.getAssignedTo() != null ? ticket.getAssignedTo().getId() : null,
	            ticket.getAssignedTo() != null ? ticket.getAssignedTo().getName() : null
	        ))
	        .collect(Collectors.toList());
	}


	@Override
	public TicketResponse updateTicket(Long id, TicketRequest request) {
		Ticket ticket = ticketRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + id));

		if (request.title() != null)
			ticket.setTitle(request.title());
		if (request.description() != null)
			ticket.setDescription(request.description());
		if (request.status() != null)
			ticket.setStatus(request.status());

		if (request.assignedToUserId() != null) {
			User assignedUser = userRepository.findById(request.assignedToUserId()).orElseThrow(
					() -> new RuntimeException("Assigned user not found with ID: " + request.assignedToUserId()));
			ticket.setAssignedTo(assignedUser);
		}

		Ticket updated = ticketRepository.save(ticket);

		return new TicketResponse(updated.getId(), updated.getTitle(), updated.getDescription(), updated.getStatus(),
				updated.getCreatedAt(), updated.getAssignedTo() != null ? updated.getAssignedTo().getId() : null,
				updated.getAssignedTo() != null ? updated.getAssignedTo().getName() : null);
	}

	@Override
	public void deleteTicket(Long id) {
		Ticket ticket = ticketRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Ticket not found with ID: " + id));

		ticketRepository.delete(ticket);
	}
}
