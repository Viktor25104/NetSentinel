package platform.netsentinel.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import platform.netsentinel.model.Server;
import platform.netsentinel.repository.ServerRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service class for managing server registration, updates, and status.
 */
@Service
public class ServerService {

    private final ServerRepository serverRepository;

    public ServerService(ServerRepository serverRepository) {
        this.serverRepository = serverRepository;
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

    /**
     * Update the status of the server identified by sessionId.
     *
     * @param sessionId the session ID of the server
     * @param status    the new status (e.g. "online", "offline")
     */
    public void updateServerStatus(String sessionId, String status) {
        serverRepository.findBySessionId(sessionId).ifPresent(server -> {
            server.setStatus(status);
            server.setLastPing(LocalDateTime.now());
            serverRepository.save(server);
        });
    }
}
