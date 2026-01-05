
package fonzigo.backend.service;

import fonzigo.backend.dto.CarritoDTO;

public interface CarritoService {
    CarritoDTO getCartByUserId(Long userId);
    CarritoDTO addProductToCart(Long userId, Long productId, int quantity);
    CarritoDTO updateCartItemQuantity(Long userId, Long cartItemId, int quantity);
    CarritoDTO removeProductFromCart(Long userId, Long cartItemId);
    CarritoDTO clearCart(Long userId);
}
