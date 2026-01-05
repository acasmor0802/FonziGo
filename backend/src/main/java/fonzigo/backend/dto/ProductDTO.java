// backend/src/main/java/fonzigo/backend/dto/ProductDTO.java

package fonzigo.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDTO {
    private Long id;
    
    @NotBlank(message = "El nombre del producto es requerido")
    @Size(min = 2, max = 255, message = "El nombre debe tener entre 2 y 255 caracteres")
    private String name;
    
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String description;
    
    @PositiveOrZero(message = "El stock no puede ser negativo")
    private Integer stock;
    
    private String imageUrl;
    
    @NotNull(message = "El precio es requerido")
    @Positive(message = "El precio debe ser positivo")
    private BigDecimal price;
    
    private BigDecimal originalPrice;
    
    private String unit = "unidad";
    
    private Double rating = 0.0;
    
    private Integer ratingCount = 0;
    
    private Boolean onSale = false;
    
    @NotNull(message = "La categoría es requerida")
    private Long categoryId;
    
    private String categoryName;
    
    private Long supermarketId;
    
    private String supermarketName;
}
