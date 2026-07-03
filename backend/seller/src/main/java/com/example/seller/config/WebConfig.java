package com.example.seller.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.dir}")
    private String uploadDir;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns(
                        "http://localhost:*",
                        "http://127.0.0.1:*",
                        "http://192.168.*:*",
                        "http://10.*:*"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);

        registry.addMapping("/uploads/**")
                .allowedOriginPatterns(
                        "http://localhost:*",
                        "http://127.0.0.1:*",
                        "http://192.168.*:*",
                        "http://10.*:*"
                )
                .allowedMethods("GET", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        List<Path> candidatePaths = new ArrayList<>();

        Path primaryUploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        candidatePaths.add(primaryUploadPath);

        Path backendModuleUploadPath = Paths.get("backend", "seller")
                .resolve(uploadDir)
                .toAbsolutePath()
                .normalize();
        if (!backendModuleUploadPath.equals(primaryUploadPath)) {
            candidatePaths.add(backendModuleUploadPath);
        }

        String[] resourceLocations = candidatePaths.stream()
                .filter(Files::exists)
                .map(Path::toUri)
                .map(java.net.URI::toString)
                .map(location -> location.endsWith("/") ? location : location + "/")
                .distinct()
                .toArray(String[]::new);

        if (resourceLocations.length == 0) {
            resourceLocations = new String[] {
                    primaryUploadPath.toUri().toString().endsWith("/")
                            ? primaryUploadPath.toUri().toString()
                            : primaryUploadPath.toUri().toString() + "/"
            };
        }

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocations);
    }
}
