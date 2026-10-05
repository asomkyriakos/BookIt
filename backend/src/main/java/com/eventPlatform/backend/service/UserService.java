package com.eventPlatform.backend.service;

import com.eventPlatform.backend.entity.User;
import com.eventPlatform.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    public List<User> findByRole(String role) {
        return userRepository.findByRole(role);
    }
    public User save(User user) {
        return userRepository.save(user);
}

}