package com.uniflow.system.config;

import com.uniflow.system.model.User;
import com.uniflow.system.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public OAuth2SuccessHandler(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
            
            // Redirect to frontend with token, role, name and email
            String targetUrl = "http://localhost:3000/oauth2/redirect?token=" + token + 
                               "&role=" + user.getRole().name() + 
                               "&name=" + (user.getName() != null ? user.getName() : "") +
                               "&email=" + user.getEmail();
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        } else {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "User creation failed");
        }
    }
}
