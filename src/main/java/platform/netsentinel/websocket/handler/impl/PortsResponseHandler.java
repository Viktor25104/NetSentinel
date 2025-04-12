package platform.netsentinel.websocket.handler.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import platform.netsentinel.dto.agent.AgentResponse;
import platform.netsentinel.dto.websocket.NetworkPortDto;
import platform.netsentinel.websocket.handler.WebSocketMessageHandler;

import java.util.List;

@Component
public class PortsResponseHandler implements WebSocketMessageHandler {

    @Override
    public String getType() {
        return "ports";
    }

    @Override
    public void handle(AgentResponse response, SimpMessagingTemplate messagingTemplate) {
        try {
            List<NetworkPortDto> list = new ObjectMapper().convertValue(
                    response.payload(), new TypeReference<>() {}
            );
            messagingTemplate.convertAndSend("/topic/agent/" + response.sessionId() + "/ports", list);
        } catch (IllegalArgumentException e) {
            System.err.println("❌ Ports десериализация: " + e.getMessage());
        }
    }
}

