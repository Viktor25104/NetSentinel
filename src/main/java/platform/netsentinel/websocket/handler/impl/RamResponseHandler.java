package platform.netsentinel.websocket.handler.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import platform.netsentinel.dto.agent.AgentResponse;
import platform.netsentinel.dto.websocket.RamInfoDto;
import platform.netsentinel.websocket.handler.WebSocketMessageHandler;

@Component
public class RamResponseHandler implements WebSocketMessageHandler {

    @Override
    public String getType() {
        return "ram";
    }

    @Override
    public void handle(AgentResponse response, SimpMessagingTemplate messagingTemplate) {
        try {
            RamInfoDto dto = new ObjectMapper().convertValue(response.payload(), RamInfoDto.class);
            messagingTemplate.convertAndSend("/topic/agent/" + response.sessionId() + "/ram", dto);
        } catch (IllegalArgumentException e) {
            System.err.println("❌ RAM десериализация: " + e.getMessage());
        }
    }
}

