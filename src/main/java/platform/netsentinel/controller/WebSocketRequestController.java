package platform.netsentinel.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import platform.netsentinel.dto.agent.AgentResponse;
import platform.netsentinel.websocket.dispatcher.AgentResponseDispatcher;
import platform.netsentinel.websocket.service.AgentRequestService;

/**
 * Handles communication between the backend and agent clients using WebSocket.
 */
@Controller
public class WebSocketRequestController {

    private final AgentRequestService agentRequestService;
    private final AgentResponseDispatcher agentResponseDispatcher;

    public WebSocketRequestController(AgentRequestService agentRequestService, AgentResponseDispatcher agentResponseDispatcher) {
        this.agentRequestService = agentRequestService;
        this.agentResponseDispatcher = agentResponseDispatcher;
    }

    /**
     * Обрабатывает ответ от агента (через WebSocket /app/response).
     */
    @MessageMapping("/response")
    public void handleAgentResponse(AgentResponse response) {
        agentRequestService.completeAgentResponse(
                response.sessionId(),
                response.type(),
                response.payload()
        );

        agentResponseDispatcher.dispatch(response);
    }
}
