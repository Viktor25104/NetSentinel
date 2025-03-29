package platform.netsentinel.dto;

import lombok.*;

/**
 * DTO representing server information sent from the agent to the platform.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ServerInfo {

    /**
     * Unique session identifier assigned to the agent.
     */
    private String sessionId;

    /**
     * Server name (e.g. "Server-01").
     */
    private String name;

    /**
     * IP address of the server.
     */
    private String ip;

    /**
     * Type of operating system (e.g. Linux, Windows).
     */
    private String type;

    /**
     * Server status (e.g. online, offline, maintenance).
     */
    private String status;

    /**
     * Physical or logical location of the server.
     */
    private String location;

    /**
     * Uptime of the server in seconds.
     */
    private long uptime;

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
}
