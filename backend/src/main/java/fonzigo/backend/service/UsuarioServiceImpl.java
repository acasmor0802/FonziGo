
package fonzigo.backend.service;

import fonzigo.backend.dto.UsuarioDTO;
import fonzigo.backend.dto.UsuarioRegistroDTO;
import fonzigo.backend.entity.Usuario;
import fonzigo.backend.repository.UsuarioRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<UsuarioDTO> getAllUsers() {
        return usuarioRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioDTO getUserById(Long id) {
        Usuario user = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDto(user);
    }

    @Override
    public UsuarioDTO getUserByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + email));
        return convertToDto(usuario);
    }


    @Override
    public UsuarioDTO registerUser(UsuarioRegistroDTO usuarioRegistroDTO) {
        Usuario user = new Usuario();
        BeanUtils.copyProperties(usuarioRegistroDTO, user);
        user.setPassword(passwordEncoder.encode(usuarioRegistroDTO.getPassword()));
        Usuario savedUser = usuarioRepository.save(user);
        return convertToDto(savedUser);
    }

    @Override
    public UsuarioDTO updateUser(Long id, UsuarioDTO usuarioDTO) {
        Usuario user = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(usuarioDTO.getName());
        user.setEmail(usuarioDTO.getEmail());
        user.setPhone(usuarioDTO.getPhone());
        // Password update should be handled separately
        Usuario updatedUser = usuarioRepository.save(user);
        return convertToDto(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        usuarioRepository.deleteById(id);
    }

    private UsuarioDTO convertToDto(Usuario user) {
        UsuarioDTO userDTO = new UsuarioDTO();
        BeanUtils.copyProperties(user, userDTO);
        return userDTO;
    }
}
