package platform.netsentinel.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import platform.netsentinel.model.Server;
import platform.netsentinel.model.User;
import platform.netsentinel.repository.UserRepository;
import platform.netsentinel.service.ServerService;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/server")
public class ServerController {

    private final ServerService serverService;
    private final UserRepository userRepository;

    public ServerController(ServerService serverService, UserRepository userRepository) {
        this.serverService = serverService;
        this.userRepository = userRepository;
    }

    @GetMapping("/all")
    public List<Server> getAllServers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Collections.emptyList();
        }

        String email = authentication.getName();

        System.out.println(email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return serverService.getServersByCompanyId(user.getCompany().getId());
    }


}
