
package fonzigo.backend.dto;

import lombok.Data;

@Data
public class ElementoCarritoDTO {
    private Long id;
    private Long productId;
    private String productName;
    private int quantity;
}
