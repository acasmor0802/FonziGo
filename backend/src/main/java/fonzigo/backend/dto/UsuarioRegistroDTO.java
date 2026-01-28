// backend/src/main/java/fonzigo/backend/dto/UsuarioRegistroDTO.java

package fonzigo.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UsuarioRegistroDTO {
    
    @Size(max = 35, message = "El nombre no puede exceder 35 caracteres")
    private String name;
    
    @NotBlank(message = "El email es requerido")
    @Email(message = "El email debe ser válido")
    private String email;
    
    @Pattern(regexp = "^[0-9]{9,15}$", message = "El teléfono debe tener entre 9 y 15 dígitos")
    private String phone;
    
    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;
}
