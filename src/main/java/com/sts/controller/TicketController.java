package com.sts.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sts.dto.request.TicketRequest;
import com.sts.dto.response.TicketResponse;
import com.sts.service.TicketService;

@RestController
@RequestMapping("/tickets")
public class TicketController {

	@Autowired
	private TicketService ticketService;

	@PostMapping("/createTicket")
	public ResponseEntity<TicketResponse> createTicket(@RequestBody TicketRequest request) {
		return new ResponseEntity<>(ticketService.createTicket(request), HttpStatus.CREATED);
	}

	@GetMapping("/GetAllTickets")
	public ResponseEntity<List<TicketResponse>> getAllTickets() {
		return ResponseEntity.ok(ticketService.getAllTickets());
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<TicketResponse> updateTicket(@PathVariable Long id, @RequestBody TicketRequest request) {
		return ResponseEntity.ok(ticketService.updateTicket(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteTicket(@PathVariable Long id) {
		ticketService.deleteTicket(id);
		return ResponseEntity.ok("Ticket with ID " + id + " has been deleted successfully.");
	}

}