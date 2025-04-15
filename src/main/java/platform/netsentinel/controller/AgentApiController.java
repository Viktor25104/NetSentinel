package platform.netsentinel.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import platform.netsentinel.model.Server;
import platform.netsentinel.service.ServerService;
import platform.netsentinel.websocket.service.AgentRequestService;

import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
public class AgentApiController {

    private final AgentRequestService agentRequestService;
    private final ServerService serverService;
    private final SimpMessagingTemplate messagingTemplate;


    @GetMapping("/{serverId}/{type}")
    public ResponseEntity<Object> getMetric(
            @PathVariable Long serverId,
            @PathVariable String type
    ) {
        Object response = agentRequestService.requestAgentData(serverId, type);

        if (response instanceof String && ((String) response).startsWith("Error:")) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{serverId}/process_kill/{pid}")
    public ResponseEntity<String> killProcess(
            @PathVariable Long serverId,
            @PathVariable String pid
    ) {
        try {
            Server server = serverService.getServerById(serverId);
            String sessionId = server.getSessionId();

            if (sessionId == null || sessionId.isBlank()) {
                return ResponseEntity.badRequest().body("Error: server has no active session");
            }

            String topic = "/topic/server/" + sessionId + "/command";
            String command = "process_kill_" + pid;

            messagingTemplate.convertAndSend(topic, command);

            return ResponseEntity.ok("Sent command: " + command);
        } catch(NoSuchElementException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch(Exception e) {
            return ResponseEntity.status(500).body("Unexpected error: " + e.getMessage());
        }
    }

    @GetMapping("/{serverId}/autorun_toggle/{name}")
    public ResponseEntity<String> toggleAutorun(
            @PathVariable Long serverId,
            @PathVariable String name
    ) {
        try {
            Server server = serverService.getServerById(serverId);
            String sessionId = server.getSessionId();

            if (sessionId == null || sessionId.isBlank()) {
                return ResponseEntity.badRequest().body("Error: server has no active session");
            }

            String topic = "/topic/server/" + sessionId + "/command";
            String command = "autorun_toggle_" + name;

            messagingTemplate.convertAndSend(topic, command);

            return ResponseEntity.ok("Sent command: " + command);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Unexpected error: " + e.getMessage());
        }
    }


}





