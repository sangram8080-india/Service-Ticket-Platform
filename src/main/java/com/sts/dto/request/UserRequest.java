package com.sts.dto.request;

/*public record UserRequest(String email,
	    String password,
	    String name,
	    String phone,
	    String department,
	    String role )


{ }*/
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRequest(

		@NotBlank(message = "Email is required") @Email(message = "Invalid email format") 
		String email,

		@NotBlank(message = "Password is required") @Size(min = 6, message = "Password must be at least 6 characters long")
		String password,

		@NotBlank(message = "Name is required")
		String name,

		@NotBlank(message = "Phone is required")
		// @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10
		// digits")
		String phone,

		@NotBlank(message = "Department is required") 
		String department,

		@NotBlank(message = "Role is required") 
		String role

) {
}
