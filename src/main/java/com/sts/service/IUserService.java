package com.sts.service;

import java.util.List;

import com.sts.dto.request.UserRequest;
import com.sts.dto.response.UserResponce;

public interface IUserService
{

	UserResponce createUser(UserRequest request);

	List<UserResponce> getAllUsers();

	UserResponce updateUser(Long id, UserRequest request);
	
	void deleteUser(Long id);


}
