package com.sts.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sts.dto.request.UserRequest;
import com.sts.dto.response.UserResponce;
import com.sts.entity.User;
import com.sts.enums.UserRole;
import com.sts.exception_handling.UserNotFoundException;
import com.sts.repository.UserRepository;
import com.sts.service.IUserService;

@Service
public class UserServiceImpl implements IUserService {

	@Autowired
	private UserRepository userRepository;

	/* <<---------------------This Method Create New User--------------------->> */
	@Override
	public UserResponce createUser(UserRequest request) {
		User user = new User();

		user.setEmail(request.email());

		user.setPassword(request.password());

		user.setName(request.name());

		user.setPhone(request.phone());

		user.setDepartment(request.department());

		user.setRole(UserRole.valueOf(request.role()));

		/* <,-----------------Saving User Object to database---------------->>> */

		User savedUser = userRepository.save(user);

		/* <<--------------------Returning UserResponce Object--------------->>> */
		return new UserResponce(savedUser.getId(), savedUser.getName(), // FIXED: was swapped with email
				savedUser.getEmail(), savedUser.getPhone(), savedUser.getDepartment(), savedUser.getRole(), // FIXED:
																											// Enum
																											// type, not
																											// String
				savedUser.getCreatedAt(), savedUser.getUpdatedAt());

	}

	/* <<------------This Method Return All Users-------------------------->> */
	@Override
	public List<UserResponce> getAllUsers() {
		List<User> users = userRepository.findAll();

		return users.stream()
				.map(user -> new UserResponce(user.getId(), user.getName(), user.getEmail(), user.getPhone(),
						user.getDepartment(), user.getRole(), // ✅ Pass UserRole enum directly
						user.getCreatedAt(), user.getUpdatedAt()))
				.collect(Collectors.toList());
	}

	@Override
	public UserResponce updateUser(Long id, UserRequest request) {
		// 1. Fetch existing user
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

		user.setName(request.name());
		user.setEmail(request.email());
		user.setPassword(request.password());
		user.setPhone(request.phone());
		user.setDepartment(request.department());
		user.setRole(UserRole.valueOf(request.role()));

		User updatedUser = userRepository.save(user);

		return new UserResponce(updatedUser.getId(), updatedUser.getName(), updatedUser.getEmail(),
				updatedUser.getPhone(), updatedUser.getDepartment(), updatedUser.getRole(), updatedUser.getCreatedAt(),
				updatedUser.getUpdatedAt());
	}
	
	@Override
	public void deleteUser(Long id) {
	    User user = userRepository.findById(id)
	        .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
	    
	         userRepository.delete(user);
	}


}
