package com.example.seller.security;
 
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
 
import java.util.List;
 
@Configuration
@EnableWebSecurity
public class SecurityConfig {
 
    private final JwtFilter jwtFilter;
 
    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }
 
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/notifications/**").permitAll()
                .requestMatchers(HttpMethod.POST,
                    "/api/seller/register",
                    "/api/seller/login",
                    "/api/seller/forgot-password",
                    "/api/seller/verify-otp",
                    "/api/seller/reset-password",
                    "/api/seller/profile/**",
                    "/api/seller/settings/**",
                    "/api/seller/support",
                    "/api/seller/payouts/**",
                    "/api/seller/products/add",
                    "/api/seller/delivery-partners",
                    "/api/complaints/**",
                    "/api/ai/**",
                    "/api/customer/addresses",
                    "/api/customer/addresses/**",
                    "/api/customer/**",
                    "/api/notifications/**",
                    "/api/orders/**",
                    "/api/reviews/**",
                    "/api/payments/**",
                    "/api/admin/**"
                ).permitAll()
                .requestMatchers(HttpMethod.GET,
                    "/api/complaints/**",
                    "/api/ai/**",
                    "/api/customer/addresses",
                    "/api/customer/addresses/**",
                    "/api/seller/profile/**",
                    "/api/seller/settings/**",
                    "/api/seller/support",
                    "/api/seller/payouts/**",
                    "/api/products/**",
                    "/api/customer/**",
                    "/api/notifications/**",
                    "/api/seller/orders",
                    "/api/seller/delivery-partners",
                    "/api/reviews/**",
                    "/api/admin/**",
                    "/uploads/**"
                ).permitAll()
                .requestMatchers(HttpMethod.DELETE,
                    "/api/customer/addresses/**",
                    "/api/customer/**"
                    ,
                    "/api/notifications/**"
                ).permitAll()
                .requestMatchers(
                    "/api/seller/register",
                    "/api/seller/login",
                    "/api/seller/forgot-password",
                    "/api/seller/verify-otp",
                    "/api/seller/reset-password",
                    "/api/seller/profile/**",
                    "/api/seller/settings/**",
                    "/api/seller/support",
                    "/api/seller/payouts/**",
                    "/api/seller/products/**",
                    "/api/seller/delivery-partners",
                    "/api/complaints/**",
                    "/api/ai/**",
                    "/api/customer/addresses",
                    "/api/customer/addresses/**",
                    "/api/customer/**",
                    "/api/notifications/**",
                    "/api/orders/**",
                    "/api/reviews/**",
                    "/api/payments/**",
                    "/api/products/**",
                    "/api/admin/**",
                    "/uploads/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
 
        return http.build();
    }
 
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
 
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:*",
            "http://127.0.0.1:*",
            "http://192.168.*:*",
            "http://10.*:*"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
        config.setExposedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(false);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
 
