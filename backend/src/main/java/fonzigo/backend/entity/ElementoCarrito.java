
package fonzigo.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class ElementoCarrito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Carrito cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;
}
