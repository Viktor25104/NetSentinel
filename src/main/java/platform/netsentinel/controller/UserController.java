package platform.netsentinel.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import platform.netsentinel.dto.auth.ChangePasswordRequest;
import platform.netsentinel.dto.auth.NewUserDto;
import platform.netsentinel.dto.auth.UserDto;
import platform.netsentinel.model.Company;
import platform.netsentinel.model.Role;
import platform.netsentinel.model.User;
import platform.netsentinel.service.UserService;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/{id}")
    public User getUserProfile(@PathVariable Long id) {
        return userService.findById(id);
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

    @PutMapping("/profileUpdate")
    public ResponseEntity<?> updateProfile(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String phone,
            @RequestParam String position,
            @RequestParam String department,
            @RequestParam String bio,
            @RequestParam String location,
            @RequestParam String timezone,
            @RequestParam boolean notifyEmail,
            @RequestParam boolean notifyPush,
            @RequestParam boolean notifyTelegram,
            @RequestParam(required = false) String avatarUrl
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone);
        user.setPosition(position);
        user.setDepartment(department);
        user.setBio(bio);
        user.setLocation(location);
        user.setTimezone(timezone);
        user.setNotifyEmail(notifyEmail);
        user.setNotifyPush(notifyPush);
        user.setNotifyTelegram(notifyTelegram);

        if (avatarUrl != null && !avatarUrl.isBlank()) {
            user.setAvatar(avatarUrl);
        }

        userService.save(user);

        return ResponseEntity.ok("Профиль успешно обновлён");
    }

    @PostMapping("/changePasswordWithCheck")
    public ResponseEntity<?> changePasswordWithCheck(
            @RequestBody ChangePasswordRequest request
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Не авторизован");
        }

        System.out.println(auth.getName());
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of("message", "Текущий пароль неверен")
            );
        }

        if (request.newPassword() == null || request.newPassword().length() < 6) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Новый пароль должен быть не менее 6 символов")
            );
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userService.save(user);

        return ResponseEntity.ok(Map.of("message", "Пароль успешно обновлён"));
    }

    @GetMapping("/all")
    public List<User> getUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Collections.emptyList();
        }

        String email = authentication.getName();

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long companyId = user.getCompany().getId();

        return userService.getUsersByCompanyId(companyId);
    }

    @PutMapping("/{id}/employment-status")
    public ResponseEntity<?> updateEmploymentStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        userService.updateEmploymentStatus(id, status);
        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody NewUserDto dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = auth.getName();
        User creator = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Создающий пользователь не найден"));

        Company company = creator.getCompany();

        User newUser = User.builder()
                .email(dto.email())
                .password(passwordEncoder.encode(dto.password()))
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .position(dto.position())
                .department(dto.department())
                .role(Role.USER)
                .status("offline")
                .employmentStatus("inactive")
                .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + dto.email())
                .company(company)
                .joinDate(LocalDate.now().toString())
                .build();

        userService.save(newUser);

        return ResponseEntity.ok(Map.of("message", "Пользователь создан"));
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(
            @RequestBody String password
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Пароль не может быть пустым"));
        }

        User user = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));

        user.setPassword(passwordEncoder.encode(password));
        userService.save(user);

        return ResponseEntity.ok(Map.of("message", "Пароль успешно изменён"));
    }

}
