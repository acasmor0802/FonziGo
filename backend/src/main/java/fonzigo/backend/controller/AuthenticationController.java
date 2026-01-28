package fonzigo.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import fonzigo.backend.dto.GoogleAuthRequestDTO;
import fonzigo.backend.dto.LoginRequestDTO;
import fonzigo.backend.dto.LoginResponseDTO;
import fonzigo.backend.dto.UsuarioDTO;
import fonzigo.backend.dto.UsuarioRegistroDTO;
import fonzigo.backend.security.JwtService;
import fonzigo.backend.service.GoogleAuthService;
import fonzigo.backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Autenticación y registro de usuarios")
public class AuthenticationController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final GoogleAuthService googleAuthService;

    public AuthenticationController(UsuarioService usuarioService, 
                                  JwtService jwtService,
                                  AuthenticationManager authenticationManager,
                                  GoogleAuthService googleAuthService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.googleAuthService = googleAuthService;
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar nuevo usuario", description = "Crea una nueva cuenta de usuario")
    public ResponseEntity<UsuarioDTO> register(@Valid @RequestBody UsuarioRegistroDTO request) {
        UsuarioDTO usuario = usuarioService.registerUser(request);
        return ResponseEntity.status(201).body(usuario);
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario y retorna un token JWT")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails);

            LoginResponseDTO response = new LoginResponseDTO(
                token,
                86400000L,
                request.getEmail()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener usuario actual", description = "Retorna los datos del usuario autenticado")
    public ResponseEntity<UsuarioDTO> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UsuarioDTO usuario = usuarioService.getUserByEmail(email);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/google")
    @Operation(summary = "Iniciar sesión con Google", description = "Autentica un usuario usando su cuenta de Google")
    public ResponseEntity<LoginResponseDTO> googleLogin(@Valid @RequestBody GoogleAuthRequestDTO request) {
        try {
            LoginResponseDTO response = googleAuthService.authenticateWithGoogle(request.getCredential());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/check-email")
    @Operation(summary = "Verificar disponibilidad de email", description = "Comprueba si un email ya está registrado")
    public ResponseEntity<java.util.Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = usuarioService.emailExists(email);
        return ResponseEntity.ok(java.util.Map.of("exists", exists));
    }
}
