package fonzigo.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import fonzigo.backend.dto.LoginResponseDTO;
import fonzigo.backend.entity.Usuario;
import fonzigo.backend.repository.UsuarioRepository;
import fonzigo.backend.security.JwtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

/**
 * Servicio de autenticación con Google OAuth2.
 * Verifica tokens de Google y gestiona usuarios autenticados con Google.
 */
@Service
@Slf4j
@Transactional(readOnly = true)
public class GoogleAuthService {

    private static final long TOKEN_EXPIRATION_MS = 86400000L; // 24 horas

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final GoogleIdTokenVerifier verifier;

    public GoogleAuthService(UsuarioRepository usuarioRepository, 
                            JwtService jwtService,
                            @Value("${google.client-id:}") String clientId) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        
        this.verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), 
                GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    @Transactional
    public LoginResponseDTO authenticateWithGoogle(String credential) {
        log.info("Autenticando usuario con Google");
        
        GoogleIdToken idToken = verifyGoogleToken(credential);
        GoogleIdToken.Payload payload = idToken.getPayload();
        
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String pictureUrl = (String) payload.get("picture");

        Usuario usuario = usuarioRepository.findByEmail(email)
                .map(existingUser -> updateExistingGoogleUser(existingUser, name, pictureUrl))
                .orElseGet(() -> createGoogleUser(email, name, pictureUrl));

        String token = generateJwtToken(usuario);
        log.info("Usuario {} autenticado exitosamente con Google", email);
        
        return new LoginResponseDTO(token, TOKEN_EXPIRATION_MS, email);
    }

    private GoogleIdToken verifyGoogleToken(String credential) {
        try {
            GoogleIdToken idToken = verifier.verify(credential);
            if (idToken == null) {
                throw new BadCredentialsException("Token de Google inválido");
            }
            return idToken;
        } catch (Exception e) {
            log.error("Error verificando token de Google: {}", e.getMessage());
            throw new BadCredentialsException("Error al verificar token de Google: " + e.getMessage());
        }
    }

    private Usuario updateExistingGoogleUser(Usuario usuario, String name, String pictureUrl) {
        // Solo actualizar avatar si es nulo (no sobrescribir personalización del usuario)
        Optional.ofNullable(pictureUrl)
                .filter(url -> usuario.getAvatarUrl() == null)
                .ifPresent(usuario::setAvatarUrl);
        
        // Solo actualizar nombre si es nulo
        Optional.ofNullable(name)
                .filter(n -> usuario.getName() == null)
                .ifPresent(usuario::setName);
        
        return usuarioRepository.save(usuario);
    }

    private Usuario createGoogleUser(String email, String name, String pictureUrl) {
        log.info("Creando nuevo usuario de Google: {}", email);
        Usuario usuario = new Usuario();
        usuario.setEmail(email);
        usuario.setName(Optional.ofNullable(name).orElse(email.split("@")[0]));
        usuario.setPassword(UUID.randomUUID().toString());
        usuario.setGoogleUser(true);
        usuario.setAvatarUrl(pictureUrl);
        return usuarioRepository.save(usuario);
    }

    private String generateJwtToken(Usuario usuario) {
        UserDetails userDetails = User.builder()
                .username(usuario.getEmail())
                .password("")
                .authorities("ROLE_USER")
                .build();
        return jwtService.generateToken(userDetails);
    }
}
