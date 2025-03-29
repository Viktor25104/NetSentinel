package platform.netsentinel.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import platform.netsentinel.model.Server;
import platform.netsentinel.repository.ServerRepository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service responsible for monitoring and updating the status of servers.
 * Marks servers as "offline" if they haven't pinged the system within a certain time.
 */
@Service
public class ServerStatusService {

    private final ServerRepository serverRepository;

    public ServerStatusService(ServerRepository serverRepository) {
        this.serverRepository = serverRepository;
    }

    /**
     * Scheduled task that checks the status of all servers.
     * If a server hasn't pinged in the last 2 minutes, its status is marked as "offline".
     *
     * This method runs every 2 minutes (120000 milliseconds).
     */
    @Scheduled(fixedRate = 120000)
    public void checkServerStatus() {
        List<Server> servers = serverRepository.findAll();

        for (Server server : servers) {
            if (server.getLastPing().isBefore(LocalDateTime.now().minusMinutes(2))) {
                server.setStatus("offline");
                serverRepository.save(server);
            }
        }
    }
}
