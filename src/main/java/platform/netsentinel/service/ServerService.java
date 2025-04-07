package platform.netsentinel.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import platform.netsentinel.controller.WebSocketRequestController;
import platform.netsentinel.dto.ServerInfo;
import platform.netsentinel.model.Server;
import platform.netsentinel.repository.ServerRepository;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Service class for managing server registration, updates, and status.
 */
@Service
public class ServerService {

    private final ServerRepository serverRepository;
    private final WebSocketRequestController wsController;

    public ServerService(ServerRepository serverRepository, WebSocketRequestController wsController) {
        this.serverRepository = serverRepository;
        this.wsController = wsController;
    }

    /**
     * Retrieve all registered servers.
     *
     * @return list of all servers
     */
    public List<Server> getServers() {
        return serverRepository.findAll();
    }

    /**
     * Register a new server or update an existing one based on sessionId or IP address.
     *
     * @param server the server object received from the agent
     * @return assigned sessionId for the server
     */
    @Transactional
    public String registerOrUpdateServer(Server server) {
        Optional<Server> existingServer = serverRepository.findBySessionId(server.getSessionId());

        if (existingServer.isPresent()) {
            Server existing = existingServer.get();
            existing.setLastPing(LocalDateTime.now());
            existing.setStatus("online");
            existing.setCpuUsage(server.getCpuUsage());
            existing.setMemoryUsage(server.getMemoryUsage());
            existing.setDiskUsage(server.getDiskUsage());
            existing.setUpTime(server.getUpTime());

            serverRepository.save(existing);
            return existing.getSessionId();
        }

        Optional<Server> serverByIp = serverRepository.findByIp(server.getIp());
        if (serverByIp.isPresent()) {
            Server existing = serverByIp.get();
            String newSessionId = UUID.randomUUID().toString();
            existing.setSessionId(newSessionId);
            existing.setLastPing(LocalDateTime.now());
            existing.setStatus("online");

            serverRepository.save(existing);
            return newSessionId;
        }

        String sessionId = UUID.randomUUID().toString();
        server.setSessionId(sessionId);
        server.setLastPing(LocalDateTime.now());
        server.setStatus("online");

        serverRepository.save(server);
        return sessionId;
    }

    @Scheduled(fixedRate = 100000)
    public void updaterMetrics() {
        List<Server> servers = getServers();
        ObjectMapper mapper = new ObjectMapper();

        for (Server server : servers) {
            if ("warning".equals(server.getStatus())) {
                continue;
            }

            String response = wsController.requestAgentData(server.getId(), "info");
            try {
                ServerInfo info = mapper.readValue(response, ServerInfo.class);

                Server currentServer = serverRepository.findById(server.getId())
                        .orElseThrow(() -> new Exception("Server not found"));
                currentServer.setLastPing(LocalDateTime.now());
                currentServer.setStatus("online");
                currentServer.setCpuUsage(info.getCpuUsage());
                currentServer.setMemoryUsage(info.getMemoryUsage());
                currentServer.setDiskUsage(info.getDiskUsage());

                serverRepository.save(currentServer);
            } catch (Exception e) {
                System.err.println("Ошибка при обновлении метрик для сервера с ID " + server.getId() + ": " + e.getMessage());
                e.printStackTrace();

                Optional<Server> currentServerOpt = serverRepository.findById(server.getId());
                if (currentServerOpt.isPresent()) {
                    Server currentServer = currentServerOpt.get();
                    currentServer.setStatus("offline");
                    currentServer.setLastPing(LocalDateTime.now());
                    serverRepository.save(currentServer);
                }
            }
        }
    }


    public List<Server> getServersByCompanyId(Long companyId) {
        return serverRepository.findByCompanyId(companyId);
    }

}
