package com.uniflow.system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final com.uniflow.system.service.CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(JwtFilter jwtFilter, 
                          com.uniflow.system.service.CustomOAuth2UserService customOAuth2UserService,
                          OAuth2SuccessHandler oAuth2SuccessHandler,
                          CustomAuthenticationEntryPoint authenticationEntryPoint,
                          CustomAccessDeniedHandler accessDeniedHandler) {
        this.jwtFilter = jwtFilter;
        this.customOAuth2UserService = customOAuth2UserService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for role-based testing
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(authenticationEntryPoint) // Handle 401
                .accessDeniedHandler(accessDeniedHandler) // Handle 403
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**", "/login/**", "/oauth2/**").permitAll() // Public
                .requestMatchers("/api/public/**").permitAll() // Public Booking Verification
                .requestMatchers("/ws-notifications/**").permitAll() // WebSocket Notifications
                .requestMatchers("/admin/**").hasRole("ADMIN") // Admin only
                .requestMatchers("/api/technician/**").hasRole("TECHNICIAN") // Technician only
                .requestMatchers("/user/**").hasRole("USER") // User only
                .requestMatchers("/api/files/download/**").permitAll() // Allow viewing images publically/easily
                .anyRequest().authenticated() // All others must be logged in (any role)
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                .successHandler(oAuth2SuccessHandler)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // Add custom JWT Filter

        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // Allow localhost and local network IPs for mobile testing
        config.setAllowedOriginPatterns(List.of("http://localhost:3000", "http://192.168.*.*:3000", "http://10.*.*.*:3000", "http://172.*.*.*:3000"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

