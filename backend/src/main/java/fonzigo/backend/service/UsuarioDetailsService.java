package fonzigo.backend.service;

import fonzigo.backend.entity.Usuario;
import fonzigo.backend.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service("usuarioDetailsService")
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        // Asigna rol basado en el usuario
        String role = "ROLE_USER";
        if (usuario.getRole() != null && usuario.getRole().equals("ADMIN")) {
            role = "ROLE_ADMIN";
        }

        return org.springframework.security.core.userdetails.User
            .builder()
            .username(usuario.getEmail())
            .password(usuario.getPassword())
            .authorities(role)
            .build();
    }
}
