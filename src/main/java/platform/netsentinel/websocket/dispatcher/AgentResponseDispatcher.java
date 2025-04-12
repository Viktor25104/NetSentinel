package platform.netsentinel.websocket.dispatcher;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import platform.netsentinel.dto.agent.AgentResponse;
import platform.netsentinel.websocket.handler.WebSocketMessageHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Component
public class AgentResponseDispatcher {

    private final Map<String, WebSocketMessageHandler> handlers;
    private final SimpMessagingTemplate messagingTemplate;

    public AgentResponseDispatcher(
            List<WebSocketMessageHandler> handlerList,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.messagingTemplate = messagingTemplate;
        this.handlers = new HashMap<>();
        for (WebSocketMessageHandler handler : handlerList) {
            handlers.put(handler.getType(), handler);
        }
    }

    public void dispatch(AgentResponse response) {
        WebSocketMessageHandler handler = handlers.get(response.type());
        if (handler != null) {
            handler.handle(response, messagingTemplate);
        }
    }
}

