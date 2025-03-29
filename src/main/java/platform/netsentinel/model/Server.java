package platform.netsentinel.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Entity representing a server registered in the platform.
 */
@Entity
@Table(name = "servers")
@Getter
@Setter
public class Server {

    /**
     * Unique identifier for the server record in the database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * WebSocket session ID associated with the server agent.
     */
    private String sessionId;

    /**
     * Name of the server.
     */
    private String name;

    /**
     * IP address of the server.
     */
    private String ip;

    /**
     * Type of operating system running on the server (e.g. Linux, Windows).
     */
    private String type;

    /**
     * Current status of the server (online, offline, maintenance).
     */
    private String status;

    /**
     * Physical or logical location of the server.
     */
    private String location;

    /**
     * Uptime in human-readable format (e.g. "24h").
     */
    private String upTime;

    /**
     * Current CPU usage percentage.
     */
    private int cpuUsage;

    /**
     * Current memory usage percentage.
     */
    private int memoryUsage;

    /**
     * Current disk usage percentage.
     */
    private int diskUsage;

    /**
     * Identifier of the company that owns the server.
     */
    private long companyId;

    /**
     * Timestamp of the last ping from the agent.
     */
    private LocalDateTime lastPing;
}
