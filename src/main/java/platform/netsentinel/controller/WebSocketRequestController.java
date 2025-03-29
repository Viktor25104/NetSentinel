package platform.netsentinel.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import platform.netsentinel.model.Server;
import platform.netsentinel.repository.ServerRepository;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Handles communication between the backend and agent clients using WebSocket.
 */
@Controller
@RequestMapping("/api/agent")
public class WebSocketRequestController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ServerRepository serverRepository;
    private final Map<String, CompletableFuture<String>> pendingResponses = new ConcurrentHashMap<>();
    private static final short RESPONSE_TIMEOUT = 10;

    /**
     * Constructor for dependency injection.
     *
     * @param messagingTemplate used to send WebSocket messages
     * @param serverRepository repository for accessing server entities
     */
    public WebSocketRequestController(SimpMessagingTemplate messagingTemplate, ServerRepository serverRepository) {
        this.messagingTemplate = messagingTemplate;
        this.serverRepository = serverRepository;
    }

    /**
     * Sends a WebSocket message to the agent and awaits a response.
     *
     * @param serverId ID of the server
     * @param dataType type of data requested (e.g., cpu, ram)
     * @return response from the agent or error message
     */
    private String requestAgentData(Long serverId, String dataType) {
        String requestKey = null;
        try {
            Optional<Server> serverOpt = serverRepository.findById(serverId);
            if (serverOpt.isEmpty()) {
                return "Error: Server with ID " + serverId + " not found";
            }

            Server server = serverOpt.get();
            String sessionId = server.getSessionId();
            if (sessionId == null || sessionId.isEmpty()) {
                return "Error: Server " + serverId + " (" + server.getName() + ") has no sessionId";
            }

            requestKey = sessionId + ":" + dataType;
            System.out.println("Sending WebSocket request to agent with sessionId: " + sessionId + " and dataType: " + dataType);

            CompletableFuture<String> responseFuture = new CompletableFuture<>();
            pendingResponses.put(requestKey, responseFuture);

            messagingTemplate.convertAndSend("/topic/server/" + sessionId + "/" + dataType, "request");

            String result = responseFuture.get(RESPONSE_TIMEOUT, TimeUnit.SECONDS);
            System.out.println("Received response from agent for " + dataType + ": " + result);
            return result;
        } catch (Exception e) {
            System.err.println("Error while retrieving data for " + dataType + ": " + e.getMessage());
            e.printStackTrace();
            return "Error retrieving data: " + e.getMessage();
        } finally {
            if (requestKey != null) {
                pendingResponses.remove(requestKey);
            }
        }
    }

    /**
     * Handles incoming responses from the agent.
     *
     * @param message response string in the format "sessionId:dataType:data"
     */
    @MessageMapping("/response")
    public void handleAgentResponse(String message) {
        System.out.println("📩 Received response from agent: " + message);

        String[] parts = message.split(":", 3);
        if (parts.length == 3) {
            String sessionId = parts[0];
            String dataType = parts[1];
            String data = parts[2];
            String requestKey = sessionId + ":" + dataType;

            CompletableFuture<String> responseFuture = pendingResponses.get(requestKey);
            if (responseFuture != null) {
                responseFuture.complete(data);
                System.out.println("✅ Response handled for " + requestKey);
            } else {
                System.out.println("⚠️ Response received but no one is waiting: " + requestKey);
            }
        } else {
            System.err.println("❌ Invalid response format from agent: " + message);
        }
    }

    /**
     * REST controller for agent data endpoints.
     */
    @RestController
    @RequestMapping("/api/agent")
    public static class AgentApiController {

        private final WebSocketRequestController wsController;

        /**
         * Constructor for API controller.
         *
         * @param wsController main WebSocket controller
         */
        public AgentApiController(WebSocketRequestController wsController) {
            this.wsController = wsController;
        }

        @GetMapping("/{serverId}/cpu")
        public String getCpuInfo(@PathVariable Long serverId) {
            return wsController.requestAgentData(serverId, "cpu");
        }

        @GetMapping("/{serverId}/ram")
        public String getRamInfo(@PathVariable Long serverId) {
            return wsController.requestAgentData(serverId, "ram");
        }

        @GetMapping("/{serverId}/disk")
        public String getDiskInfo(@PathVariable Long serverId) {
            return wsController.requestAgentData(serverId, "disk");
        }

        @GetMapping("/{serverId}/network")
        public String getNetworkInfo(@PathVariable Long serverId) {
            return wsController.requestAgentData(serverId, "network");
        }

        @GetMapping("/{serverId}/process")
        public String getProcessList(@PathVariable Long serverId) {
            return wsController.requestAgentData(serverId, "process");
        }

        @GetMapping("/{serverId}/ports")
        public String getPortsInfo(@PathVariable Long serverId) {
            return wsController.requestAgentData(serverId, "ports");
        }

        @GetMapping("/{serverId}/startup")
        public String getStartupList(@PathVariable Long serverId) {
            return wsController.requestAgentData(serverId, "startup");
        }
    }
}
