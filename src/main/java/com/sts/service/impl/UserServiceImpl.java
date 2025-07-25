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
public class UserServiceImpl implements IUserService 
{

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

		return new UserResponce(savedUser.getId(), savedUser.getEmail(), savedUser.getName(), savedUser.getPhone(),
				savedUser.getDepartment(), savedUser.getRole().name());

		 
	}

	
	/* <<------------This Method Return All Users-------------------------->> */
	@Override
	public List<UserResponce> getAllUsers() 
	{


		/* <<--------------------Accessing Data from Database----------->> */
		List<User> allUsers = userRepository.findAll();

		
		
		/* <<------Here We cannot return User data directly that's why we are converting  user data to UserResponce------------>>*/

		List<UserResponce> UserList = allUsers.stream()
				.map(user -> new UserResponce(user.getId(), user.getEmail(), user.getName(), user.getPhone(),
						user.getDepartment(), user.getRole().name()))
				.collect(Collectors.toList());
 
		return UserList;
	}
	
	
	/*<<----------------This Method find user and update their details------------------->>*/

	@Override
	public UserResponce updateUser(Long id, UserRequest request) 
	{
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

		return new UserResponce(updatedUser.getId(), updatedUser.getEmail(), updatedUser.getName(),
				updatedUser.getPhone(), updatedUser.getDepartment(), updatedUser.getRole().name());
	}


	/*<<-----------------------This Method delete User from Database-------------------------->>*/
	
	@Override
	public void deleteUser(Long id) 
	{
		User user = userRepository.findById(id)
				.orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));

		userRepository.delete(user);
	}

}
