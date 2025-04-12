package platform.netsentinel.websocket.handler.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import platform.netsentinel.dto.agent.AgentResponse;
import platform.netsentinel.dto.websocket.PacketDto;
import platform.netsentinel.websocket.handler.WebSocketMessageHandler;

import java.util.List;

@Component
public class SnifferResponseHandler implements WebSocketMessageHandler {

    @Override
    public String getType() {
        return "sniffer";
    }

    @Override
    public void handle(AgentResponse response, SimpMessagingTemplate messagingTemplate) {
        try {
            List<PacketDto> list = new ObjectMapper().convertValue(
                    response.payload(), new TypeReference<>() {}
            );
            messagingTemplate.convertAndSend("/topic/agent/" + response.sessionId() + "/sniffer", list);
        } catch (IllegalArgumentException e) {
            System.err.println("❌ Sniffer десериализация: " + e.getMessage());
        }
    }
}

