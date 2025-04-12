package platform.netsentinel.websocket.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import platform.netsentinel.model.Server;
import platform.netsentinel.repository.ServerRepository;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.*;

/**
 * Сервис для общения с агентами по WebSocket:
 * отправка запросов и получение ответов.
 *
 * @author Viktor Marymorych
 */
@Service
@RequiredArgsConstructor
public class AgentRequestService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ServerRepository serverRepository;

    private final Map<String, CompletableFuture<Object>> pendingResponses = new ConcurrentHashMap<>();

    private static final short RESPONSE_TIMEOUT = 10;

    /**
     * Запрашивает у агента конкретный тип данных по sessionId.
     *
     * @param sessionId ID активной WebSocket-сессии агента
     * @param dataType  тип данных (cpu, ram, disk и т.д.)
     * @return future с ответом, либо таймаут через {@link #RESPONSE_TIMEOUT} секунд
     */
    public CompletableFuture<Object> request(String sessionId, String dataType) {
        String key = sessionId + ":" + dataType;

        CompletableFuture<Object> future = new CompletableFuture<>();
        pendingResponses.put(key, future);

        messagingTemplate.convertAndSend("/topic/server/" + sessionId + "/" + dataType, "request");

        return future.orTimeout(RESPONSE_TIMEOUT, TimeUnit.SECONDS)
                .whenComplete((res, ex) -> pendingResponses.remove(key));
    }

    /**
     * Упрощённый метод для REST: получить данные по serverId (как раньше).
     *
     * @param serverId ID сервера из БД
     * @param dataType тип данных
     * @return объект-ответ от агента, либо сообщение об ошибке
     */
    public Object requestAgentData(Long serverId, String dataType) {
        Optional<Server> serverOpt = serverRepository.findById(serverId);
        if (serverOpt.isEmpty()) return "Error: Server not found";

        Server server = serverOpt.get();
        String sessionId = server.getSessionId();
        if (sessionId == null || sessionId.isBlank()) {
            return "Error: Server has no active session";
        }

        try {
            return request(sessionId, dataType).get();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    /**
     * Вызывается при получении ответа от агента через WebSocket.
     *
     * @param sessionId ID WebSocket-сессии
     * @param type      тип данных
     * @param payload   объект ответа
     */
    public void completeAgentResponse(String sessionId, String type, Object payload) {
        String key = sessionId + ":" + type;
        CompletableFuture<Object> future = pendingResponses.get(key);

        if (future != null) {
            future.complete(payload);
        } else {
            System.out.println("⚠ Ответ получен, но никто его не ждал: " + key);
        }
    }
}
