
package fonzigo.backend.controller;

import fonzigo.backend.dto.AddToCartRequestDTO;
import fonzigo.backend.dto.CarritoDTO;
import fonzigo.backend.dto.UpdateCartItemDTO;
import fonzigo.backend.service.CarritoService;
import fonzigo.backend.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Cart", description = "Gestión del carrito de compras")
@SecurityRequirement(name = "bearerAuth")
public class CarritoController {

    private final CarritoService carritoService;
    private final UsuarioService usuarioService;

    public CarritoController(CarritoService carritoService, UsuarioService usuarioService) {
        this.carritoService = carritoService;
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @Operation(summary = "Obtener carrito del usuario actual")
    public ResponseEntity<CarritoDTO> getMyCart(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = usuarioService.getUserIdByEmail(userDetails.getUsername());
        CarritoDTO cart = carritoService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    @Operation(summary = "Añadir producto al carrito")
    public ResponseEntity<CarritoDTO> addProductToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AddToCartRequestDTO request) {
        Long userId = usuarioService.getUserIdByEmail(userDetails.getUsername());
        CarritoDTO cart = carritoService.addProductToCart(userId, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/items/{cartItemId}")
    @Operation(summary = "Actualizar cantidad de un item del carrito")
    public ResponseEntity<CarritoDTO> updateCartItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long cartItemId,
            @RequestBody UpdateCartItemDTO request) {
        Long userId = usuarioService.getUserIdByEmail(userDetails.getUsername());
        CarritoDTO cart = carritoService.updateCartItemQuantity(userId, cartItemId, request.getQuantity());
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items/{cartItemId}")
    @Operation(summary = "Eliminar item del carrito")
    public ResponseEntity<CarritoDTO> removeProductFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long cartItemId) {
        Long userId = usuarioService.getUserIdByEmail(userDetails.getUsername());
        CarritoDTO cart = carritoService.removeProductFromCart(userId, cartItemId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Vaciar el carrito")
    public ResponseEntity<CarritoDTO> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = usuarioService.getUserIdByEmail(userDetails.getUsername());
        CarritoDTO cart = carritoService.clearCart(userId);
        return ResponseEntity.ok(cart);
    }
}
