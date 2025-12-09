
package fonzigo.backend.controller;

import fonzigo.backend.dto.AddToCartRequestDTO;
import fonzigo.backend.dto.CarritoDTO;
import fonzigo.backend.service.CarritoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CarritoDTO> getCartByUserId(@PathVariable Long userId) {
        CarritoDTO cart = carritoService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<CarritoDTO> addProductToCart(@PathVariable Long userId, @RequestBody AddToCartRequestDTO request) {
        CarritoDTO cart = carritoService.addProductToCart(userId, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CarritoDTO> removeProductFromCart(@PathVariable Long cartItemId) {
        CarritoDTO cart = carritoService.removeProductFromCart(cartItemId);
        return ResponseEntity.ok(cart);
    }
}
