package platform.netsentinel.websocket.handler.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import platform.netsentinel.dto.agent.AgentResponse;
import platform.netsentinel.dto.websocket.DiskInfoDto;
import platform.netsentinel.websocket.handler.WebSocketMessageHandler;

@Component
public class DiskResponseHandler implements WebSocketMessageHandler {

    @Override
    public String getType() {
        return "disk";
    }

    @Override
    public void handle(AgentResponse response, SimpMessagingTemplate messagingTemplate) {
        try {
            DiskInfoDto dto = new ObjectMapper().convertValue(response.payload(), DiskInfoDto.class);
            // TODO: обработка дисков, отправка в UI, сохранение и т.д.
        } catch (IllegalArgumentException e) {
            System.err.println("❌ Disk десериализация: " + e.getMessage());
        }
    }
}

