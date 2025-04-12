package platform.netsentinel.websocket.handler.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import platform.netsentinel.dto.agent.AgentResponse;
import platform.netsentinel.dto.websocket.StartupItemDto;
import platform.netsentinel.websocket.handler.WebSocketMessageHandler;

import java.util.List;

@Component
public class StartupResponseHandler implements WebSocketMessageHandler {

    @Override
    public String getType() {
        return "startup";
    }

    @Override
    public void handle(AgentResponse response, SimpMessagingTemplate messagingTemplate) {
        try {
            List<StartupItemDto> list = new ObjectMapper().convertValue(
                    response.payload(), new TypeReference<>() {}
            );
            messagingTemplate.convertAndSend("/topic/agent/" + response.sessionId() + "/startup", list);
        } catch (IllegalArgumentException e) {
            System.err.println("❌ Startup десериализация: " + e.getMessage());
        }
    }
}

