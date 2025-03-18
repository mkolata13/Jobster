package com.api.jobster.service;

import com.api.jobster.enums.Role;
import com.api.jobster.model.User;
import com.api.jobster.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> allUsers() {
        return new ArrayList<>(userRepository.findAll());
    }

    public List<User> allUsersByRole(Role role) {
        List<User> users = new ArrayList<>();
        for (User user : allUsers()) {
            if (user.getRole().equals(role) && user.isEnabled()) {
                users.add(user);
            }
        }
        return users;
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }
}
