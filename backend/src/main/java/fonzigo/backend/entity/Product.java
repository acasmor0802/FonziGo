
package fonzigo.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Entidad que representa un producto en el catálogo.
 * Cada producto pertenece a una categoría y un supermercado.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product", indexes = {
    @Index(name = "idx_product_category", columnList = "category_id"),
    @Index(name = "idx_product_supermarket", columnList = "supermarket_id"),
    @Index(name = "idx_product_name", columnList = "name"),
    @Index(name = "idx_product_on_sale", columnList = "onSale")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre es requerido")
    @Size(max = 255, message = "El nombre no puede exceder 255 caracteres")
    @Column(nullable = false)
    private String name;
    
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    @Column(length = 1000)
    private String description;
    
    @PositiveOrZero(message = "El stock no puede ser negativo")
    @Column(nullable = false)
    private Integer stock = 0;
    
    @Column(length = 500)
    private String imageUrl;
    
    @NotNull(message = "El precio es requerido")
    @Positive(message = "El precio debe ser positivo")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal originalPrice;
    
    @Size(max = 50)
    @Column(length = 50, nullable = false)
    private String unit = "unidad";
    
    @DecimalMin(value = "0.0", message = "El rating no puede ser negativo")
    @DecimalMax(value = "5.0", message = "El rating no puede exceder 5.0")
    @Column(nullable = false)
    private Double rating = 0.0;
    
    @PositiveOrZero(message = "El contador de ratings no puede ser negativo")
    @Column(nullable = false)
    private Integer ratingCount = 0;
    
    @Column(nullable = false)
    private Boolean onSale = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supermarket_id")
    private Supermarket supermarket;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return id != null && Objects.equals(id, product.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Product{id=" + id + ", name='" + name + "', price=" + price + "}";
    }
}
