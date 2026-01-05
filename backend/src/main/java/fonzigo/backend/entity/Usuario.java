package fonzigo.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Entidad que representa un usuario del sistema.
 * Soporta autenticación local y con Google OAuth2.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "usuario", indexes = {
    @Index(name = "idx_usuario_email", columnList = "email", unique = true)
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    @Column(length = 100)
    private String name;

    @NotBlank(message = "El email es requerido")
    @Email(message = "El email debe ser válido")
    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    @Column(length = 20)
    private String phone;

    @JsonIgnore
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private Boolean googleUser = false;
    
    @Column(columnDefinition = "TEXT")
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pedido> recentPurchases = new ArrayList<>();

    @JsonIgnore
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Carrito cart;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Usuario usuario = (Usuario) o;
        return id != null && Objects.equals(id, usuario.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Usuario{id=" + id + ", email='" + email + "', role=" + role + "}";
    }
}
