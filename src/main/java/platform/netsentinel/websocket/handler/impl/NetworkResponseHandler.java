package platform.netsentinel.websocket.handler.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import platform.netsentinel.dto.agent.AgentResponse;
import platform.netsentinel.dto.websocket.NetworkInterfaceDto;
import platform.netsentinel.websocket.handler.WebSocketMessageHandler;

import java.util.List;

@Component
public class NetworkResponseHandler implements WebSocketMessageHandler {

    @Override
    public String getType() {
        return "network";
    }

    @Override
    public void handle(AgentResponse response, SimpMessagingTemplate messagingTemplate) {
        try {
            List<NetworkInterfaceDto> list = new ObjectMapper().convertValue(
                    response.payload(), new TypeReference<>() {}
            );
            messagingTemplate.convertAndSend("/topic/agent/" + response.sessionId() + "/network", list);
        } catch (IllegalArgumentException e) {
            System.err.println("❌ Network десериализация: " + e.getMessage());
        }
    }
}

