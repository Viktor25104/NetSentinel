package platform.netsentinel.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import platform.netsentinel.websocket.service.AgentRequestService;

@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
public class AgentApiController {

    private final AgentRequestService agentRequestService;

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



}
