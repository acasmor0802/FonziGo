
package fonzigo.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class UsuarioDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    // We don't expose password in DTO
    // We can create separate DTOs for recent purchases and cart if needed
}
