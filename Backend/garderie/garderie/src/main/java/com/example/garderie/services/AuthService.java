
package com.example.garderie.services;

import com.example.garderie.dto.SignupRequest;
import com.example.garderie.entities.User;

public interface AuthService {
    User createUser(SignupRequest signupRequest);
}