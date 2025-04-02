package platform.netsentinel.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class to define CORS (Cross-Origin Resource Sharing) settings.
 * Allows frontend requests from http://localhost:4200 with specified methods and headers.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Configures global CORS mapping for all endpoints.
     *
     * @param registry the CORS registry to add mappings to
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
