
package fonzigo.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class LineaPedidoDTO {
    private Long id;
    private Long productId;
    private String productName;
    private int quantity;
    private BigDecimal price;
}
