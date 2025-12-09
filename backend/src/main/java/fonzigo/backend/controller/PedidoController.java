
package fonzigo.backend.controller;

import fonzigo.backend.dto.PedidoDTO;
import fonzigo.backend.service.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<PedidoDTO> createOrderFromCart(@PathVariable Long userId) {
        PedidoDTO createdOrder = pedidoService.createOrderFromCart(userId);
        return ResponseEntity.status(201).body(createdOrder);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PedidoDTO>> getOrdersForUser(@PathVariable Long userId) {
        List<PedidoDTO> orders = pedidoService.getOrdersForUser(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<PedidoDTO> getOrderById(@PathVariable Long orderId) {
        PedidoDTO order = pedidoService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }
}
