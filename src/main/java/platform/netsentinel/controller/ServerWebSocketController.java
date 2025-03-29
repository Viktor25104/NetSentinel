package platform.netsentinel.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import platform.netsentinel.dto.ServerInfo;
import platform.netsentinel.model.Server;
import platform.netsentinel.service.ServerService;

/**
 * Handles WebSocket messages related to server registration from agents.
 */
@Controller
public class ServerWebSocketController {

    private final ServerService serverService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Constructor for dependency injection.
     *
     * @param serverService service for managing servers
     * @param messagingTemplate template for sending WebSocket messages
     */
    public ServerWebSocketController(ServerService serverService, SimpMessagingTemplate messagingTemplate) {
        this.serverService = serverService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Handles server registration messages sent from agents.
     *
     * @param info server information received from the agent
     */
    @MessageMapping("/register")
    public void registerServer(ServerInfo info) {
        System.out.println("📥 Received server info from agent: " + info);

        Server server = new Server();
        server.setSessionId(info.getSessionId());
        server.setName(info.getName());
        server.setIp(info.getIp());
        server.setType(info.getType());
        server.setStatus(info.getStatus());
        server.setLocation(info.getLocation());
        server.setUpTime(convertUptime(info.getUptime()));
        server.setCpuUsage(info.getCpuUsage());
        server.setMemoryUsage(info.getMemoryUsage());
        server.setDiskUsage(info.getDiskUsage());
        server.setCompanyId(info.getCompanyId());

        String sessionId = serverService.registerOrUpdateServer(server);
        String sessionChannel = "/queue/session/" + info.getIp();

        // Send sessionId twice for reliability
        messagingTemplate.convertAndSend(sessionChannel, sessionId);
        messagingTemplate.convertAndSend(sessionChannel, sessionId);

        System.out.println("✅ sessionId sent: " + sessionId);
    }

    /**
     * Converts uptime in seconds to a formatted string in hours.
     *
     * @param seconds uptime in seconds
     * @return formatted uptime string (e.g., "24h")
     */
    private String convertUptime(long seconds) {
        long hours = seconds / 3600;
        return hours + "h";
    }
}
