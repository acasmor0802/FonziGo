// backend/src/main/java/fonzigo/backend/dto/UsuarioDTO.java

package fonzigo.backend.dto;

import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
}
