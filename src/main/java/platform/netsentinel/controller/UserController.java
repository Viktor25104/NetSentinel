package platform.netsentinel.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import platform.netsentinel.model.User;
import platform.netsentinel.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    Map<String, Object> profile = new HashMap<>();
                    profile.put("userId", user.getId());
                    profile.put("firstName", user.getFirstName());
                    profile.put("lastName", user.getLastName());
                    profile.put("email", user.getEmail());
                    profile.put("position", user.getPosition());
                    profile.put("department", user.getDepartment());
                    profile.put("avatar", user.getAvatar());
                    profile.put("phone", user.getPhone());
                    profile.put("location", user.getLocation());
                    profile.put("timezone", user.getTimezone());
                    profile.put("bio", user.getBio());
                    profile.put("notifyEmail", user.isNotifyEmail());
                    profile.put("notifyPush", user.isNotifyPush());
                    profile.put("notifyTelegram", user.isNotifyTelegram());
                    return ResponseEntity.ok(profile);
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
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
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();
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

        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }




}
