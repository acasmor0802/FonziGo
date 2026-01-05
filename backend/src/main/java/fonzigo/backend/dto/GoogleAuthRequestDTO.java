package fonzigo.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleAuthRequestDTO {
    @NotBlank(message = "El token de Google es requerido")
    private String credential;
}
