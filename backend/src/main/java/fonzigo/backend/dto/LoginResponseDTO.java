package fonzigo.backend.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private String token;
    private Long expiresIn;
    private String email;

    public LoginResponseDTO(String token, Long expiresIn, String email) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.email = email;
    }
}
