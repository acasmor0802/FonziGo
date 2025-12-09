
package fonzigo.backend.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private Integer stock;
    private String imageUrl;
    private Long categoryId;
}
