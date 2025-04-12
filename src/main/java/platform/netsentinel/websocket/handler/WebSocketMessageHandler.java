package platform.netsentinel.websocket.handler;

import platform.netsentinel.dto.agent.AgentResponse;
import org.springframework.messaging.simp.SimpMessagingTemplate;

/**
 * Интерфейс для обработки входящих WebSocket-сообщений от агентов.
 */
public interface WebSocketMessageHandler {

    /**
     * Тип, который обрабатывает этот обработчик (например, "cpu", "info", "ram").
     */
    String getType();

    /**
     * Обрабатывает входящее сообщение.
     *
     * @param response сообщение от агента
     * @param messagingTemplate WebSocket-шлюз для отправки ответа (если нужно)
     */
    void handle(AgentResponse response, SimpMessagingTemplate messagingTemplate);
}
