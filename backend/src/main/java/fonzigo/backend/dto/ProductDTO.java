// backend/src/main/java/fonzigo/backend/dto/ProductDTO.java

package fonzigo.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    
    @NotBlank(message = "El nombre del producto es requerido")
    @Size(min = 2, max = 255, message = "El nombre debe tener entre 2 y 255 caracteres")
    private String name;
    
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String description;
    
    @NotNull(message = "El stock es requerido")
    @PositiveOrZero(message = "El stock no puede ser negativo")
    private Integer stock;
    
    private String imageUrl;
    
    @NotNull(message = "La categoría es requerida")
    private Long categoryId;
}
