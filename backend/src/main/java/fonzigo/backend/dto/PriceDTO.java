
package fonzigo.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PriceDTO {
    private Long id;
    private Long productId;
    private Long supermarketId;
    private BigDecimal price;
    private boolean onSale;
}
