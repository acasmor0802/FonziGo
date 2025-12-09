
package fonzigo.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime orderDate;

    private String status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Usuario user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<LineaPedido> orderItems;
}
