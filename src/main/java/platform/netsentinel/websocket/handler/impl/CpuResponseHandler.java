package platform.netsentinel.websocket.handler.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import platform.netsentinel.dto.agent.AgentResponse;
import platform.netsentinel.websocket.handler.WebSocketMessageHandler;

@Slf4j
@Component
public class CpuResponseHandler implements WebSocketMessageHandler {

    @Override
    public String getType() {
        return "cpu";
    }

    @Override
    public void handle(AgentResponse response, SimpMessagingTemplate messagingTemplate) {
        log.info("🧠 Получен CPU ответ от session {}: {}", response.sessionId(), response.payload());

        messagingTemplate.convertAndSend("/topic/agent/" + response.sessionId() + "/cpu", response.payload());

    }

}
