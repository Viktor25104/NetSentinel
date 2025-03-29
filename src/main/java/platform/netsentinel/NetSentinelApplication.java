package platform.netsentinel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Entry point for the NetSentinel Spring Boot application.
 *
 * Enables scheduling to allow execution of scheduled tasks,
 * such as periodic server status checks.
 */
@SpringBootApplication
@EnableScheduling
public class NetSentinelApplication {

	/**
	 * Launches the Spring Boot application.
	 *
	 * @param args command-line arguments passed to the application
	 */
	public static void main(String[] args) {
		SpringApplication.run(NetSentinelApplication.class, args);
	}

}
