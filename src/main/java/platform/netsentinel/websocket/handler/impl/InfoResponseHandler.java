package platform.netsentinel.websocket.handler.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import platform.netsentinel.dto.agent.AgentResponse;
import platform.netsentinel.dto.agent.ServerInfoDto;
import platform.netsentinel.service.ServerService;
import platform.netsentinel.websocket.handler.WebSocketMessageHandler;

@Slf4j
@Component
public class InfoResponseHandler implements WebSocketMessageHandler {

    private final ServerService serverService;

    public InfoResponseHandler(ServerService serverService) {
        this.serverService = serverService;
    }

    @Override
    public String getType() {
        return "info";
    }

    /**
     * Обрабатывает входящий ответ типа `info` от агента.
     * Обновляет статус сервера и метрики в БД.
     * В случае ошибки — логирует и ничего не делает.
     *
     * @param response           объект ответа от агента
     * @param messagingTemplate  шаблон для публикации сообщений в STOMP
     */
    @Override
    public void handle(AgentResponse response, SimpMessagingTemplate messagingTemplate) {
        log.info("📦 Получен info ответ от session {}: {}", response.sessionId(), response.payload());

        try {
            ObjectMapper mapper = new ObjectMapper();
            ServerInfoDto info = mapper.convertValue(response.payload(), ServerInfoDto.class);

            serverService.updateServerInfo(info);
            messagingTemplate.convertAndSend("/topic/agent/" + response.sessionId() + "/info", info);
        } catch (Exception e) {
            log.error("❌ Ошибка при обработке info: {}", e.getMessage(), e);
        }
    }
}

