package fonzigo.backend.controller;

import fonzigo.backend.dto.LoginRequestDTO;
import fonzigo.backend.dto.LoginResponseDTO;
import fonzigo.backend.dto.UsuarioDTO;
import fonzigo.backend.dto.UsuarioRegistroDTO;
import fonzigo.backend.security.JwtService;
import fonzigo.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationController(UsuarioService usuarioService, 
                                  JwtService jwtService,
                                  AuthenticationManager authenticationManager) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioDTO> register(@RequestBody UsuarioRegistroDTO request) {
        UsuarioDTO usuario = usuarioService.registerUser(request);
        return ResponseEntity.status(201).body(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
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
    public ResponseEntity<UsuarioDTO> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UsuarioDTO usuario = usuarioService.getUserByEmail(email);
        return ResponseEntity.ok(usuario);
    }
}
