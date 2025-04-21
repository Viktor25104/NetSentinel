package platform.netsentinel.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import platform.netsentinel.dto.auth.LoginDto;
import platform.netsentinel.dto.auth.UserDto;
import platform.netsentinel.model.User;
import platform.netsentinel.service.UserService;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        if (userService.isEmailTaken(userDto.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already in use"));
        }

        User user = userService.registerUser(userDto);
        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "userId", user.getId()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto, HttpServletRequest request) {
        Optional<User> userOpt = userService.authenticateUser(
                loginDto.getUsername(),
                loginDto.getPassword(),
                request
        );

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            UserDetails userDetails = org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .roles(user.getRole().name())
                    .build();

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);

            request.getSession(true).setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    context
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Успешный вход!");

            response.put("id", user.getId());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());

            response.put("email", user.getEmail());
            response.put("position", user.getPosition());
            response.put("department", user.getDepartment());
            response.put("role", user.getRole());
            response.put("avatar", user.getAvatar());
            response.put("phone", user.getPhone());

            response.put("location", user.getLocation());
            response.put("timezone", user.getTimezone());
            response.put("bio", user.getBio());
            response.put("joinDate", user.getJoinDate());

            response.put("notifyEmail", user.isNotifyEmail());
            response.put("notifyPush", user.isNotifyPush());
            response.put("notifyTelegram", user.isNotifyTelegram());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", "Неверный логин или пароль"
            ));
        }
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }

        String email = authentication.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return ResponseEntity.ok(user);
    }

}
