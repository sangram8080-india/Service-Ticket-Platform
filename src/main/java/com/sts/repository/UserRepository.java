package com.sts.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sts.entity.Ticket;
import com.sts.entity.User;

public interface UserRepository extends JpaRepository<User, Long>
{
	
	//List<Ticket> findByAssignedTo_Id(Long userId);

}
