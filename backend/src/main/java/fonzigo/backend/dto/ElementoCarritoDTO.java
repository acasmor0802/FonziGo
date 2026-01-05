
package fonzigo.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ElementoCarritoDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String unit;
    private String supermarketName;
    private int quantity;
}
