package platform.netsentinel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import platform.netsentinel.model.Server;

import java.util.Optional;

/**
 * Repository interface for accessing server data from the database.
 */
@Repository
public interface ServerRepository extends JpaRepository<Server, Long> {

    /**
     * Find a server by its associated WebSocket session ID.
     *
     * @param sessionId the session ID to search by
     * @return an optional server with the given session ID
     */
    Optional<Server> findBySessionId(String sessionId);

    /**
     * Find a server by its IP address.
     *
     * @param ip the IP address to search by
     * @return an optional server with the given IP address
     */
    Optional<Server> findByIp(String ip);
}
