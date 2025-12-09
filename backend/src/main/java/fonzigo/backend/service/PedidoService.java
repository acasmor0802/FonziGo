
package fonzigo.backend.service;

import fonzigo.backend.dto.PedidoDTO;
import java.util.List;

public interface PedidoService {
    PedidoDTO createOrderFromCart(Long userId);
    List<PedidoDTO> getOrdersForUser(Long userId);
    PedidoDTO getOrderById(Long orderId);
}
