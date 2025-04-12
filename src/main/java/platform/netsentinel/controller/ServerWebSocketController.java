package platform.netsentinel.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import platform.netsentinel.dto.agent.ServerInfoDto;
import platform.netsentinel.model.Server;
import platform.netsentinel.service.ServerService;

/**
 * Обрабатывает WebSocket-сообщения от агентов при регистрации сервера.
 */
@Controller
public class ServerWebSocketController {

    private final ServerService serverService;
    private final SimpMessagingTemplate messagingTemplate;

    public ServerWebSocketController(ServerService serverService, SimpMessagingTemplate messagingTemplate) {
        this.serverService = serverService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Обработка первичной регистрации сервера, полученной от агента.
     * Отправляет sessionId обратно агенту для подписки.
     *
     * @param info информация о сервере от агента
     */
    @MessageMapping("/register")
    public void registerServer(ServerInfoDto info) {
        System.out.println("📥 Получена информация от агента: " + info);

        String sessionId = serverService.registerOrUpdateServer(info);
        String sessionChannel = "/queue/session/" + info.ip();

        messagingTemplate.convertAndSend(sessionChannel, sessionId);

        System.out.println("✅ sessionId отправлен агенту: " + sessionId);
    }


    private String convertUptime(long seconds) {
        long hours = seconds / 3600;
        return hours + "h";
    }
}
