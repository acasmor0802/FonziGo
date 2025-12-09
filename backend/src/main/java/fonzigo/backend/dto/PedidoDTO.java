
package fonzigo.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PedidoDTO {
    private Long id;
    private LocalDateTime orderDate;
    private String status;
    private Long userId;
    private List<LineaPedidoDTO> orderItems;
}
