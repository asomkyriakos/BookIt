package com.eventPlatform.backend.controller;

import com.eventPlatform.backend.DTO.UserResponse;
import com.eventPlatform.backend.entity.User;
import com.eventPlatform.backend.jwt.JwtService;
import com.eventPlatform.backend.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/users")

public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService,JwtService jwtService) {
        this.userService = userService;
        this.jwtService=jwtService;
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {

        User user = userService.findById(id);

        if(user == null) {
            throw new RuntimeException("User not found");
        }

        return user;
    }

    @GetMapping("/getUsersForMessages")
    public List<UserResponse> getAllOrganisers(Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()){
            throw new RuntimeException("Not logged in");
        }

        Long userId = Long.parseLong(authentication.getName());
        User user = userService.findById(userId);
        List<UserResponse> userResponses = new ArrayList<>();

        if(user.getRole().equals("ADMIN")) {
            List<User> allUsers = userService.getAllUsers();
            for(User u : allUsers) {
                userResponses.add(new UserResponse(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(),u.getPhoneNumber(),u.getAddress(), u.getRole(), u.getStatus()));
            }
        } else if (user.getRole().equals("USER")) {
            List<User> organisersUsers = userService.findByRole("ORGANIZER");
            List<User> adminUsers = userService.findByRole("ADMIN");

            for(User u : organisersUsers) {
                userResponses.add(new UserResponse(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(),u.getPhoneNumber(),u.getAddress(), u.getRole(), u.getStatus()));
            }
            for(User u : adminUsers) {
                userResponses.add(new UserResponse(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(),u.getPhoneNumber(),u.getAddress(), u.getRole(), u.getStatus()));
            }
        } else if(user.getRole().equals("ORGANIZER")) {
            List<User> usersUsers = userService.findByRole("USER");
            List<User> adminUsers = userService.findByRole("ADMIN");

            for(User u : usersUsers) {
                userResponses.add(new UserResponse(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(),u.getPhoneNumber(),u.getAddress(), u.getRole(), u.getStatus()));
            }
            for(User u : adminUsers) {
                userResponses.add(new UserResponse(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(),u.getPhoneNumber(),u.getAddress(), u.getRole(), u.getStatus()));
            }
        }

        return userResponses;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping
    public User editUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PatchMapping
    public User patchUser(@RequestBody User user) {
        User temp =  userService.findById(user.getId());
        if(temp == null) {
            throw new RuntimeException("User not found");
        }
        if(user.getFirstName() != null) {
            temp.setFirstName(user.getFirstName());
        }
        if(user.getLastName() != null) {
            temp.setLastName(user.getLastName());
        }
        if(user.getEmail() != null) {
            temp.setEmail(user.getEmail());
        }
        if(user.getPassword() != null) {
            temp.setPassword(user.getPassword());
        }
        if(user.getPhoneNumber() != null) {
            temp.setPhoneNumber(user.getPhoneNumber());
        }
        if(user.getAddress() != null) {
            temp.setAddress(user.getAddress());
        }
        if(user.getTin() != null) {
            temp.setTin(user.getTin());
        }
        if(user.getRole() != null) {
            temp.setRole(user.getRole());
        }
        return userService.saveUser(temp);
    }

}
