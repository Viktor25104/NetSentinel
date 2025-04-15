package platform.netsentinel.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import platform.netsentinel.dto.agent.ServerInfoDto;
import platform.netsentinel.model.Server;
import platform.netsentinel.repository.ServerRepository;
import platform.netsentinel.websocket.service.AgentRequestService;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * Service class for managing server registration, updates, and status.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ServerService {

    private final ServerRepository serverRepository;
    private final AgentRequestService agentRequestService;

    /**
     * Retrieve all registered servers.
     *
     * @return list of all servers
     */
    public List<Server> getServers() {
        return serverRepository.findAll();
    }

    public Server getServerById(Long serverId) {
        return serverRepository.findById(serverId)
                .orElseThrow(() -> new NoSuchElementException("Server with ID " + serverId + " not found"));
    }

    /**
     * Register a new server or update an existing one based on sessionId or IP address.
     *
     * @param dto the server object received from the agent
     * @return assigned sessionId for the server
     */
    @Transactional
    public String registerOrUpdateServer(ServerInfoDto dto) {
        Server server = new Server();
        server.setName(dto.name());
        server.setIp(dto.ip());
        server.setType(dto.type());
        server.setStatus(dto.status());
        server.setLocation(dto.location());
        server.setUpTime(dto.uptime() + "s");
        server.setCpuUsage(dto.cpuUsage());
        server.setMemoryUsage(dto.memoryUsage());
        server.setDiskUsage(dto.diskUsage());
        server.setCompanyId(dto.companyId());

        serverRepository.save(server);
        return dto.sessionId();

    }


    @Scheduled(fixedRate = 100_000)
    public void updaterMetrics() {
        ObjectMapper mapper = new ObjectMapper();

        getServers().parallelStream()
                .filter(server -> !"warning".equals(server.getStatus()))
                .forEach(server -> {
                    try {
                        Object raw = agentRequestService
                                .request(server.getSessionId(), "info")
                                .get(10, TimeUnit.SECONDS);

                        ServerInfoDto info = mapper.convertValue(raw, ServerInfoDto.class);

                        server.setLastPing(LocalDateTime.now());
                        server.setStatus(info.status());
                        server.setCpuUsage(info.cpuUsage());
                        server.setMemoryUsage(info.memoryUsage());
                        server.setDiskUsage(info.diskUsage());

                    } catch (Exception e) {
                        server.setStatus("offline");
                        server.setLastPing(LocalDateTime.now());

                        System.err.println("❌ Ошибка получения метрик: " + server.getId() + " → " + e.getMessage());
                    }

                    serverRepository.save(server);
                });
    }


    /**
     * Обновляет статус и основные метрики сервера по sessionId.
     *
     * @param info объект с новыми данными
     */
    @Transactional
    public void updateServerInfo(ServerInfoDto info) {
        Optional<Server> optional = serverRepository.findBySessionId(info.sessionId());

        if (optional.isPresent()) {
            Server server = optional.get();
            server.setLastPing(LocalDateTime.now());

            server.setName(info.name());
            server.setIp(info.ip());
            server.setType(info.type());
            server.setStatus(info.status());
            server.setLocation(info.location());
            server.setUpTime(info.uptime() + "s");
            server.setCpuUsage(info.cpuUsage());
            server.setMemoryUsage(info.memoryUsage());
            server.setDiskUsage(info.diskUsage());
            server.setCompanyId(info.companyId());
            serverRepository.save(server);
        } else {
            log.warn("⚠️ Сервер с sessionId {} не найден", info.sessionId());
        }
    }


    public List<Server> getServersByCompanyId(Long companyId) {
        return serverRepository.findByCompanyId(companyId);
    }

}
