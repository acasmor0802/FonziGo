
package fonzigo.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class CarritoDTO {
    private Long id;
    private Long userId;
    private List<ElementoCarritoDTO> items;
}
