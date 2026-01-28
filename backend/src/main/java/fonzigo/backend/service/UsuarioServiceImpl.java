
package fonzigo.backend.service;

import fonzigo.backend.dto.UsuarioDTO;
import fonzigo.backend.dto.UsuarioRegistroDTO;
import fonzigo.backend.entity.Usuario;
import fonzigo.backend.exception.ResourceNotFoundException;
import fonzigo.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Implementación del servicio de usuarios.
 * Gestiona operaciones de registro, autenticación y perfil de usuarios.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UsuarioDTO> getAllUsers() {
        log.debug("Obteniendo todos los usuarios");
        return usuarioRepository.findAll().stream()
                .map(this::convertToDto)
                .toList();
    }

    @Override
    public UsuarioDTO getUserById(Long id) {
        log.debug("Buscando usuario con ID: {}", id);
        return usuarioRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
    }

    @Override
    public UsuarioDTO getUserByEmail(String email) {
        log.debug("Buscando usuario con email: {}", email);
        return usuarioRepository.findByEmail(email)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + email));
    }

    @Override
    public Long getUserIdByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .map(Usuario::getId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + email));
    }

    @Override
    @Transactional
    public UsuarioDTO registerUser(UsuarioRegistroDTO usuarioRegistroDTO) {
        log.info("Registrando nuevo usuario: {}", usuarioRegistroDTO.getEmail());
        
        // Verificar si el email ya existe
        usuarioRepository.findByEmail(usuarioRegistroDTO.getEmail())
                .ifPresent(u -> {
                    throw new IllegalArgumentException("El email ya está registrado: " + usuarioRegistroDTO.getEmail());
                });
        
        Usuario user = new Usuario();
        user.setEmail(usuarioRegistroDTO.getEmail());
        user.setName(usuarioRegistroDTO.getName());
        user.setPassword(passwordEncoder.encode(usuarioRegistroDTO.getPassword()));
        
        Usuario savedUser = usuarioRepository.save(user);
        log.info("Usuario registrado exitosamente con ID: {}", savedUser.getId());
        return convertToDto(savedUser);
    }

    @Override
    @Transactional
    public UsuarioDTO updateUser(Long id, UsuarioDTO usuarioDTO) {
        log.info("Actualizando usuario con ID: {}", id);
        Usuario user = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        
        // Usar Optional para actualizar solo campos no nulos
        Optional.ofNullable(usuarioDTO.getName()).ifPresent(user::setName);
        Optional.ofNullable(usuarioDTO.getEmail()).ifPresent(user::setEmail);
        Optional.ofNullable(usuarioDTO.getPhone()).ifPresent(user::setPhone);
        Optional.ofNullable(usuarioDTO.getAvatarUrl()).ifPresent(user::setAvatarUrl);
        
        Usuario updatedUser = usuarioRepository.save(user);
        return convertToDto(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        log.info("Eliminando usuario con ID: {}", id);
        Usuario user = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        usuarioRepository.delete(user);
    }

    @Override
    public boolean emailExists(String email) {
        return usuarioRepository.findByEmail(email).isPresent();
    }

    private UsuarioDTO convertToDto(Usuario user) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        dto.setGoogleUser(user.getGoogleUser());
        dto.setAvatarUrl(user.getAvatarUrl());
        return dto;
    }
}
