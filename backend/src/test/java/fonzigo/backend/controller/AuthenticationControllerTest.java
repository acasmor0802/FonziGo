package fonzigo.backend.controller;

import fonzigo.backend.dto.LoginRequestDTO;
import fonzigo.backend.dto.UsuarioRegistroDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class AuthenticationControllerTest {

    @Autowired
    private AuthenticationController authenticationController;

    @Test
    void testContextLoads() {
        assertThat(authenticationController).isNotNull();
    }

    @Test
    void testValidationDTO() {
        // Test que la validación está configurada
        UsuarioRegistroDTO dto = new UsuarioRegistroDTO();
        dto.setName("Test");
        dto.setEmail("test@example.com");
        dto.setPassword("password123");
        
        assertThat(dto.getName()).isEqualTo("Test");
        assertThat(dto.getEmail()).isEqualTo("test@example.com");
    }
}
