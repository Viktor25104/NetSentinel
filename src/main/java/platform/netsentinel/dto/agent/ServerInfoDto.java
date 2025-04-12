package platform.netsentinel.dto.agent;

/**
 * DTO representing server information sent from the agent to the platform.
 */
public record ServerInfoDto(
        String sessionId,
        String name,
        String ip,
        String type,
        String status,
        String location,
        long uptime,
        int cpuUsage,
        int memoryUsage,
        int diskUsage,
        long companyId
) {}
