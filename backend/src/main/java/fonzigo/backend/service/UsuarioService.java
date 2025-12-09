
package fonzigo.backend.service;

import fonzigo.backend.dto.UsuarioDTO;
import fonzigo.backend.dto.UsuarioRegistroDTO;

import java.util.List;

public interface UsuarioService {
    List<UsuarioDTO> getAllUsers();
    UsuarioDTO getUserById(Long id);
    UsuarioDTO registerUser(UsuarioRegistroDTO usuarioRegistroDTO);
    UsuarioDTO updateUser(Long id, UsuarioDTO usuarioDTO);
    void deleteUser(Long id);
}
